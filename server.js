const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración del transporte de correo
const createTransporter = () => {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.error('No se encontró la clave API de Resend');
    return null;
  }
  
  return nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: {
      user: 'resend',
      pass: resendApiKey,
    },
  });
};

// Función para enviar el correo de reserva
const enviarEmailReserva = async (
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
) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    throw new Error('No se pudo crear el transporte de correo');
  }
  
  // Determina si usar el dominio verificado o el dominio de prueba de Resend
  const DOMINIO_VERIFICADO = false; // Cambia a true cuando tu dominio esté verificado en Resend

  let remitente, destinatario;
  
  if (DOMINIO_VERIFICADO) {
    // Usa tu dominio personalizado cuando esté verificado
    remitente = "Reservas El Rincón De Jorgito <reservas@restaurantrincondejorgito.com>";
    destinatario = "restaurantdejorgitoadm@gmail.com";
  } else {
    // Usa el dominio de prueba de Resend y el correo autorizado
    remitente = "El Rincón De Jorgito <onboarding@resend.dev>";
    destinatario = "angelnerozzioffice@gmail.com"; // Solo podemos enviar a este correo hasta que el dominio esté verificado
  }
  
  // Formato del correo HTML
  const contenido_html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h1 style="color: #d4a762; border-bottom: 2px solid #d4a762; padding-bottom: 10px;">Nueva Reserva - El Rincón De Jorgito</h1>
    <h2 style="color: #333;">Detalles de la Reserva</h2>
    <p><strong>Tipo de Reserva:</strong> ${tipo_reserva === 'mesa' ? 'Mesa' : 'Evento'}</p>
    <p><strong>Nombre:</strong> ${nombre}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Teléfono:</strong> ${telefono}</p>
    <p><strong>Fecha:</strong> ${fecha}</p>
    <p><strong>Hora:</strong> ${hora}</p>
    <p><strong>Número de Personas:</strong> ${personas}</p>
    ${mensaje ? `<p><strong>Mensaje:</strong> ${mensaje}</p>` : ''}
    
    ${tipo_reserva === 'evento' ? `
    <h2 style="color: #333; margin-top: 20px;">Detalles del Evento</h2>
    <p><strong>Tipo de Evento:</strong> ${tipo_evento}</p>
    <p><strong>Número de Asistentes:</strong> ${asistentes}</p>
    ${descripcion_evento ? `<p><strong>Descripción:</strong> ${descripcion_evento}</p>` : ''}
    ` : ''}
    
    <p style="margin-top: 30px; font-size: 0.9em; color: #666;">Este correo ha sido generado automáticamente desde el formulario de reservas del sitio web de El Rincón De Jorgito.</p>
  </div>
  `;
  
  const mailOptions = {
    from: remitente,
    to: destinatario,
    subject: `Nueva Reserva: ${tipo_reserva === 'mesa' ? 'Mesa' : 'Evento'} - ${nombre}`,
    html: contenido_html,
    replyTo: email
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado correctamente:', info);
    return { success: true, data: info };
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};

// Ruta para manejar las reservas
app.post('/api/reservas', async (req, res) => {
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
  if (!nombre || !email || !fecha || !hora || !personas) {
    return res.status(400).json({ 
      success: false, 
      message: 'Faltan campos requeridos para la reserva' 
    });
  }

  try {
    const result = await enviarEmailReserva(
      nombre,
      email,
      telefono || '',
      fecha,
      hora,
      personas,
      mensaje || '',
      tipo_reserva,
      tipo_evento || '',
      asistentes || '',
      descripcion_evento || ''
    );
    
    res.json({
      success: true,
      message: 'Reserva enviada correctamente',
      data: result
    });
  } catch (error) {
    console.error('Error al procesar la reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la reserva',
      error: error.message
    });
  }
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API de reservas funcionando correctamente' });
});

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  // Asume que los archivos estáticos están en la carpeta 'dist'
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Manejar rutas SPA - todas las rutas no API deben ir al index.html
  app.get('*', (req, res, next) => {
    // Excluir rutas de API
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Iniciar el servidor - esto es importante para Vercel
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Exportar app para Vercel
module.exports = app; 