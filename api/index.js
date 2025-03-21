// Servidor Express para Vercel/Netlify Functions
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
import http from 'http';

// Configurar dotenv
dotenv.config();

// Crear aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta principal para comprobar que el servidor está funcionando
app.get('/api', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Ruta para enviar correos electrónicos de reserva
app.post('/api/reservas', async (req, res) => {
  try {
    const { nombre, email, telefono, fecha, hora, personas, mensaje } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !telefono || !fecha || !hora || !personas) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Configurar transportador de correo
    const transporter = createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    });

    // Configurar mensaje de correo
    const mailOptions = {
      from: 'Reservas <onboarding@resend.dev>',
      to: 'angelandres.vazquez@gmail.com',
      subject: 'Nueva reserva en El Rincón de Jorgito',
      text: `
        Nueva reserva:
        
        Nombre: ${nombre}
        Email: ${email}
        Teléfono: ${telefono}
        Fecha: ${fecha}
        Hora: ${hora}
        Personas: ${personas}
        Mensaje: ${mensaje || 'No se proporcionó mensaje'}
      `,
      html: `
        <h2>Nueva reserva en El Rincón de Jorgito</h2>
        
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Hora:</strong> ${hora}</p>
        <p><strong>Personas:</strong> ${personas}</p>
        <p><strong>Mensaje:</strong> ${mensaje || 'No se proporcionó mensaje'}</p>
      `,
    };

    // Enviar correo
    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Reserva enviada correctamente',
      id: info.messageId,
    });
  } catch (error) {
    console.error('Error al enviar la reserva:', error);
    res.status(500).json({
      error: 'Error al procesar la reserva',
      details: error.message,
    });
  }
});

// Iniciar servidor HTTP si no estamos en un entorno serverless
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  const server = http.createServer(app);
  
  server.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api`);
    console.log(`Endpoint de reservas: http://localhost:${PORT}/api/reservas`);
  });
}

// Exportar la aplicación Express para Vercel/Netlify
export default app; 