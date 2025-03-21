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

## Despliegue en Vercel (Sin npm)

Este proyecto está configurado para funcionar directamente con Vercel sin necesidad de utilizar npm durante el despliegue. Sigue estos pasos para un despliegue exitoso:

### Prerrequisitos

1. Cuenta en [Vercel](https://vercel.com)
2. Cuenta en [Resend](https://resend.com) para el envío de correos electrónicos
3. Node.js instalado localmente (solo para el build inicial)

### Pasos para desplegar en Vercel

#### 1. Preparar la carpeta `dist` (manualmente una vez)

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/rincon-de-jorgito.git
cd rincon-de-jorgito

# Instalar dependencias y hacer el build localmente
npm install
npm run build
```

Esto creará una carpeta `dist` con todos los archivos estáticos compilados.

#### 2. Configurar el proyecto en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En Vercel, importa este repositorio.
3. Durante la configuración:
   - No selecciones ningún framework o build command
   - Asegúrate de configurar la variable de entorno `RESEND_API_KEY` con tu API key de Resend

#### 3. Estructura de despliegue para Vercel

Tu despliegue debe incluir:

- Carpeta `dist/` con los archivos estáticos compilados
- Carpeta `api/` con las funciones serverless
- Archivo `vercel.json` con la configuración

#### 4. Verificar el despliegue

Una vez desplegado, verifica:
- La URL de la aplicación principal
- La función API en `/api`
- El endpoint de reservas en `/api/reservas`

## Desarrollo local

### Requisitos previos
- Node.js 14 o superior
- npm o yarn

### Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

## Tecnologías

- React
- Vite
- Tailwind CSS
- shadcn/ui
- Express (API)
- Resend (Envío de correos)

## Características

- Diseño responsive
- Sistema de reservas por correo electrónico
- Modo oscuro / claro
- Soporte para múltiples idiomas (Español / Inglés)

## Estructura del proyecto

- `/src` - Código fuente frontend
  - `/components` - Componentes React
  - `/contexts` - Contextos React (tema, idioma)
  - `/lib` - Utilitarios
- `/api` - Funciones serverless para Vercel
  - `index.js` - API principal
  - `reservas.js` - Endpoint de reservas
- `/public` - Recursos estáticos

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
