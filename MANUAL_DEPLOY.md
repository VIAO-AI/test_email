# Guía de Despliegue Manual en Vercel Sin NPM

Esta guía te muestra cómo desplegar este proyecto en Vercel sin depender del proceso de construcción con npm en la plataforma, lo que evita los problemas relacionados con dependencias como lovable-tagger.

## Paso 1: Preparar el build localmente

1. Clona el repositorio en tu máquina local:
   ```bash
   git clone https://github.com/VIAO-AI/test_email.git
   cd test_email
   ```

2. Instala las dependencias localmente:
   ```bash
   npm install
   ```

3. Crea el build de la aplicación:
   ```bash
   npm run build
   ```

   Esto generará una carpeta `dist` con los archivos estáticos de la aplicación.

## Paso 2: Preparar el repositorio para despliegue directo

1. Asegúrate de tener estos archivos y carpetas correctamente configurados:
   - Carpeta `dist/` con los archivos del build
   - Carpeta `api/` con las funciones serverless
   - Archivo `vercel.json` con la configuración

2. Confirma los cambios:
   ```bash
   git add dist/
   git add api/
   git add vercel.json
   git commit -m "Preparar para despliegue directo en Vercel"
   git push
   ```

## Paso 3: Configurar el proyecto en Vercel

1. Inicia sesión en [Vercel](https://vercel.com).

2. Haz clic en "Add New..." y selecciona "Project".

3. Importa tu repositorio de GitHub.

4. En la página de configuración del proyecto:
   - Framework Preset: Selecciona "Other" (no un framework específico)
   - Build Command: Deja en blanco (no necesitamos un comando de build)
   - Output Directory: Introduce `dist`
   
5. Expande "Environment Variables" y añade:
   - `RESEND_API_KEY`: Tu clave API de [Resend](https://resend.com)

6. Haz clic en "Deploy".

## Paso 4: Verificar el despliegue

Una vez completado el despliegue:

1. Visita la URL principal para verificar que el frontend funciona correctamente.

2. Prueba el endpoint API visitando `https://tu-dominio.vercel.app/api`.

3. Si todo funciona correctamente, el sistema de reservas debería estar operativo.

## Solución de problemas

### Si las funciones API no responden:
- Verifica que los archivos en la carpeta `api/` estén formateados correctamente.
- Asegúrate de que la variable de entorno `RESEND_API_KEY` esté configurada.
- Revisa los logs de Vercel para ver si hay errores.

### Si la aplicación frontend no carga correctamente:
- Verifica que la carpeta `dist/` contenga todos los archivos necesarios.
- Asegúrate de que `vercel.json` esté correctamente configurado.

### Si necesitas volver a hacer un build:
1. Realiza los cambios necesarios localmente.
2. Ejecuta `npm run build` de nuevo.
3. Sube los cambios a GitHub.
4. Vercel debería detectar los cambios y volver a desplegar automáticamente.

## Más información

Para más detalles sobre el despliegue en Vercel, consulta la [documentación oficial de Vercel](https://vercel.com/docs). 