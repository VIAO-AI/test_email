// Función de Netlify para manejar reservas
import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

// Configurar dotenv
dotenv.config();

export const handler = async (event, context) => {
  // Solo permitir método POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Método no permitido' }),
    };
  }

  try {
    // Parsear el cuerpo de la solicitud
    const data = JSON.parse(event.body);
    const { nombre, email, telefono, fecha, hora, personas, mensaje } = data;

    // Validar campos requeridos
    if (!nombre || !email || !telefono || !fecha || !hora || !personas) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Faltan campos requeridos' }),
      };
    }

    console.log('Enviando reserva:', data);

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
    console.log('Email enviado correctamente:', info.messageId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Reserva enviada correctamente',
        id: info.messageId,
      }),
    };
  } catch (error) {
    console.error('Error al enviar la reserva:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Error al procesar la reserva',
        details: error.message,
      }),
    };
  }
}; 