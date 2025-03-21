// Función Netlify para manejar reservas
import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

// Configurar variables de entorno
dotenv.config();

// Handler de Netlify Functions
export async function handler(event, context) {
  // Solo permitir método POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  try {
    // Parsear cuerpo de la solicitud
    const body = JSON.parse(event.body);
    const { nombre, email, telefono, fecha, hora, personas, mensaje } = body;

    // Validar campos requeridos
    if (!nombre || !email || !telefono || !fecha || !hora || !personas) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos requeridos' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    console.log('Enviando correo con datos:', { nombre, email, telefono, fecha, hora, personas });

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
    console.log('Correo enviado:', info.messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Reserva enviada correctamente',
        id: info.messageId,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('Error al enviar la reserva:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error al procesar la reserva',
        details: error.message,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
} 