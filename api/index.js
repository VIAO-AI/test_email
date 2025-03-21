// Vercel Serverless Function para manejar peticiones API
import { createTransport } from 'nodemailer';

// Configurar variables de entorno (Vercel las maneja automáticamente)
const RESEND_API_KEY = process.env.RESEND_API_KEY;

/**
 * Función principal para manejar todas las peticiones
 */
export default async function handler(req, res) {
  // Configurar encabezados CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Ruta principal para comprobar que la API está funcionando
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'API funcionando correctamente' });
  }

  // Ruta para reservas
  if (req.method === 'POST') {
    try {
      const { nombre, email, telefono, fecha, hora, personas, mensaje } = req.body;

      // Validar campos requeridos
      if (!nombre || !email || !telefono || !fecha || !hora || !personas) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      console.log('Procesando reserva:', { nombre, email, telefono, fecha, hora, personas, mensaje });

      // Verificar que tenemos la clave API
      if (!RESEND_API_KEY) {
        console.error('Error: No se encontró la clave API de Resend');
        return res.status(500).json({
          error: 'Error en la configuración del servidor',
          details: 'Falta clave API de correo'
        });
      }

      // Configurar transportador de correo
      const transporter = createTransport({
        host: 'smtp.resend.com',
        port: 465,
        secure: true,
        auth: {
          user: 'resend',
          pass: RESEND_API_KEY,
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
      console.log('Email enviado correctamente:', info.messageId);

      return res.status(200).json({
        message: 'Reserva enviada correctamente',
        id: info.messageId,
      });
    } catch (error) {
      console.error('Error al enviar la reserva:', error);
      return res.status(500).json({
        error: 'Error al procesar la reserva',
        details: error.message,
      });
    }
  }

  // Si no coincide con ninguna ruta, devolver 404
  return res.status(404).json({ error: 'Ruta no encontrada' });
} 