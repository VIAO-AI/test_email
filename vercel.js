// Configuración específica para el despliegue en Vercel
export default {
  version: 2,
  builds: [
    {
      src: "api/index.js",
      use: "@vercel/node"
    },
    {
      src: "package.json",
      use: "@vercel/static-build",
      config: {
        distDir: "dist",
        buildCommand: "vite build"
      }
    }
  ],
  routes: [
    {
      src: "/api/(.*)",
      dest: "/api/index.js"
    },
    {
      src: "/(.*)",
      dest: "/$1"
    }
  ]
};
