const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta para manejar las reservas
app.post('/api/reservas', (req, res) => {
  const {
    nombre, 
    email, 
    telefono, 
    fecha, 
    hora, 
    personas, 
    mensaje, 
    tipo_reserva = 'mesa', 
    tipo_evento = null, 
    asistentes = null, 
    descripcion_evento = null
  } = req.body;

  // Validación básica
  if (!nombre || !email || !telefono || !fecha || !hora || !personas) {
    return res.status(400).json({ 
      success: false, 
      message: 'Faltan campos requeridos para la reserva' 
    });
  }

  // Ejecutar el script de Python para enviar el email
  const pythonProcess = spawn('python', [
    'main.py',
    '--nombre', nombre,
    '--email', email,
    '--telefono', telefono,
    '--fecha', fecha,
    '--hora', hora,
    '--personas', personas,
    '--mensaje', mensaje || '',
    '--tipo_reserva', tipo_reserva,
    '--tipo_evento', tipo_evento || '',
    '--asistentes', asistentes || '',
    '--descripcion_evento', descripcion_evento || ''
  ]);

  let pythonData = '';
  let pythonError = '';

  pythonProcess.stdout.on('data', (data) => {
    pythonData += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    pythonError += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Correo enviado exitosamente:', pythonData);
      res.json({
        success: true,
        message: 'Reserva enviada correctamente',
        data: pythonData
      });
    } else {
      console.error('Error al enviar el correo:', pythonError);
      res.status(500).json({
        success: false,
        message: 'Error al procesar la reserva',
        error: pythonError
      });
    }
  });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API de reservas funcionando correctamente' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 