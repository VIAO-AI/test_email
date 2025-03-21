import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/// <reference types="vite/client" />

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Solo importamos lovable-tagger en modo desarrollo
  let componentTaggerPlugin = null;
  if (mode === 'development') {
    try {
      // Importación dinámica para evitar problemas en producción
      const { componentTagger } = require("lovable-tagger");
      componentTaggerPlugin = componentTagger();
    } catch (error) {
      console.warn("Lovable-tagger no disponible:", error);
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTaggerPlugin,
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
