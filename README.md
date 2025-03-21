# Sistema de Reservas por Correo

Este proyecto implementa un sistema de reservas para el restaurante El Rincón de Jorgito, permitiendo a los usuarios hacer reservas que se envían automáticamente por correo electrónico.

## Características

- Formulario de reserva con validación de campos
- Envío de correos usando Resend API
- API serverless para procesamiento seguro del lado del servidor
- Soporte para múltiples idiomas (español e inglés)
- Diseño responsive usando Tailwind CSS y Shadcn/ui

## Requisitos

- Node.js 16+
- NPM o Yarn
- Cuenta en Resend para envío de correos
- Cuenta en Netlify para el despliegue

## Configuración

1. Clona este repositorio:
```bash
git clone https://github.com/VIAO-AI/test_email.git
cd test_email
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con la siguiente información:
```
RESEND_API_KEY=tu_api_key_de_resend
```

4. Ejecuta el proyecto en modo desarrollo:
```bash
npm run dev
```

## Despliegue en Netlify

Este proyecto está configurado para ser desplegado en Netlify. 

### Pasos para desplegar:

1. Crea una cuenta en [Netlify](https://www.netlify.com/)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno:
   - RESEND_API_KEY

Netlify detectará automáticamente la configuración en el archivo `netlify.toml` y:
- Construirá el proyecto con `vite build`
- Publicará la carpeta `dist`
- Desplegará las funciones serverless de la carpeta `api`
- Configurará las redirecciones necesarias

### Estructura del proyecto

```
├── api/                 # Funciones serverless para Netlify
│   └── reservas.js      # Función para manejar reservas
├── public/              # Archivos estáticos
├── src/                 # Código fuente del frontend
│   ├── components/      # Componentes React
│   ├── contexts/        # Contextos React
│   ├── lib/             # Utilidades
│   └── ...
├── .env                 # Variables de entorno locales
├── netlify.toml         # Configuración de Netlify
└── package.json         # Dependencias y scripts
```

## Desarrollo local con funciones Netlify

Para probar las funciones de Netlify localmente:

1. Instala Netlify CLI globalmente:
```bash
npm install -g netlify-cli
```

2. Inicia el servidor de desarrollo de Netlify:
```bash
netlify dev
```

Esto ejecutará tanto tu aplicación frontend como las funciones serverless localmente.
