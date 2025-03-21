# Sistema actualizado para despliegue directo en Vercel sin NPM

## Configuración para despliegue sin NPM en Vercel

Este proyecto ha sido configurado para poder desplegarse directamente en Vercel sin necesidad de ejecutar comandos npm durante el proceso de construcción, evitando así problemas relacionados con dependencias y paquetes.

### Características principales:

- Funciones serverless optimizadas para Vercel
- Archivos estáticos pre-construidos incluidos en el repositorio
- Configuración simplificada en vercel.json
- No requiere ejecución de npm install ni build commands

### Pasos para desplegar:

1. Importar el repositorio directamente en Vercel
2. En la configuración del proyecto:
   - Desactivar la opción "Install Command" (dejar en blanco)
   - Desactivar la opción "Build Command" (dejar en blanco)
   - Establecer "Output Directory" como "dist"
3. Desplegar el proyecto

### Estructura del proyecto:

- `/api`: Contiene las funciones serverless para el manejo de solicitudes API
- `/dist`: Contiene los archivos estáticos pre-construidos
- `vercel.json`: Configuración para el despliegue en Vercel

### Endpoints disponibles:

- `GET /api/reservas`: Obtiene todas las reservas
- `POST /api/reservas`: Crea una nueva reserva y envía correo electrónico de confirmación

### Solución de problemas:

Si encuentras algún problema durante el despliegue, asegúrate de que:

1. El archivo vercel.json está correctamente configurado
2. La carpeta dist contiene todos los archivos estáticos necesarios
3. Las variables de entorno están configuradas en el panel de control de Vercel

Para más detalles sobre el despliegue manual, consulta el archivo MANUAL_DEPLOY.md
