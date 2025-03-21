# Sistema de Reservas - El Rincón de Jorgito

Este proyecto implementa un sistema de correo electrónico para el formulario de reservas del sitio web del restaurante "El Rincón de Jorgito".

## Funcionalidades

- Envío de correos electrónicos con detalles de reservas
- Soporte para reservas de mesa y eventos
- Integración con la API de Resend para el envío de correos

## Requisitos

- Python 3.6 o superior
- Resend API Key

## Configuración

1. Clona este repositorio
2. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```
   RESEND_API_KEY=tu_api_key_de_resend
   ```
3. Instala las dependencias:
   ```
   pip install -r requirements.txt
   ```

## Uso

Para probar el envío de correos:

```
python main.py
```

## Integración con el sitio web

Para integrar este sistema con tu formulario web, puedes:

1. Crear un endpoint API que reciba los datos del formulario
2. Llamar a la función `enviar_email_reserva` con los datos recibidos

## Configuración de dominio

Para utilizar tu dominio personalizado con Resend:

1. Verifica tu dominio en Resend
2. Configura los registros DNS necesarios
3. Cambia `DOMINIO_VERIFICADO = False` a `DOMINIO_VERIFICADO = True` en el archivo main.py

## Licencia

Todos los derechos reservados - El Rincón de Jorgito 