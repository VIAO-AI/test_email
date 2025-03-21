import os
from dotenv import load_dotenv

load_dotenv()

import resend

resend.api_key = os.environ["RESEND_API_KEY"]

# Determina si usar el dominio verificado o el dominio de prueba de Resend
DOMINIO_VERIFICADO = False  # Cambia a True cuando tu dominio esté verificado en Resend

if DOMINIO_VERIFICADO:
    # Usa tu dominio personalizado cuando esté verificado
    remitente = "Reservas El Rincón De Jorgito <reservas@restaurantrincondejorgito.com>"
    destinatario = "restaurantdejorgitoadm@gmail.com"
else:
    # Usa el dominio de prueba de Resend y el correo autorizado
    remitente = "El Rincón De Jorgito <onboarding@resend.dev>"
    destinatario = "angelnerozzioffice@gmail.com"  # Solo podemos enviar a este correo hasta que el dominio esté verificado

def enviar_email_reserva(nombre, email, telefono, fecha, hora, personas, mensaje, tipo_reserva="mesa", tipo_evento=None, asistentes=None, descripcion_evento=None):
    """
    Envía un correo electrónico con los detalles de la reserva.
    """
    # Formato del correo HTML
    contenido_html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h1 style="color: #d4a762; border-bottom: 2px solid #d4a762; padding-bottom: 10px;">Nueva Reserva - El Rincón De Jorgito</h1>
        <h2 style="color: #333;">Detalles de la Reserva</h2>
        <p><strong>Tipo de Reserva:</strong> {'Mesa' if tipo_reserva == 'mesa' else 'Evento'}</p>
        <p><strong>Nombre:</strong> {nombre}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Teléfono:</strong> {telefono}</p>
        <p><strong>Fecha:</strong> {fecha}</p>
        <p><strong>Hora:</strong> {hora}</p>
        <p><strong>Número de Personas:</strong> {personas}</p>
        {f'<p><strong>Mensaje:</strong> {mensaje}</p>' if mensaje else ''}
        
        {f'''
        <h2 style="color: #333; margin-top: 20px;">Detalles del Evento</h2>
        <p><strong>Tipo de Evento:</strong> {tipo_evento}</p>
        <p><strong>Número de Asistentes:</strong> {asistentes}</p>
        {f'<p><strong>Descripción:</strong> {descripcion_evento}</p>' if descripcion_evento else ''}
        ''' if tipo_reserva == 'evento' else ''}
        
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">Este correo ha sido generado automáticamente desde el formulario de reservas del sitio web de El Rincón De Jorgito.</p>
    </div>
    """

    params = {
        "from": remitente,
        "to": [destinatario],
        "subject": f"Nueva Reserva: {'Mesa' if tipo_reserva == 'mesa' else 'Evento'} - {nombre}",
        "html": contenido_html,
        "reply_to": email
    }

    try:
        email_response = resend.Emails.send(params)
        print(f"Correo enviado correctamente: {email_response}")
        return True, email_response
    except Exception as e:
        print(f"Error al enviar el correo: {e}")
        return False, str(e)

# Ejemplo de uso
if __name__ == "__main__":
    # Ejemplo de reserva de mesa
    enviar_email_reserva(
        nombre="Usuario de Prueba",
        email="test@example.com",
        telefono="123456789",
        fecha="2024-03-22",
        hora="19:00",
        personas="4",
        mensaje="Prueba de reserva",
        tipo_reserva="mesa"
    )
    
    # Ejemplo de reserva de evento (descomenta para probar)
    """
    enviar_email_reserva(
        nombre="Organizador de Evento",
        email="organizador@example.com",
        telefono="987654321",
        fecha="2024-04-15",
        hora="20:00",
        personas="25",
        mensaje="Necesitamos decoración especial",
        tipo_reserva="evento",
        tipo_evento="Cumpleaños",
        asistentes="25",
        descripcion_evento="Fiesta de cumpleaños con pastel y decoración"
    )
    """