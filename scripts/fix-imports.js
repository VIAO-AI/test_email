import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual del módulo ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio raíz para buscar archivos
const rootDir = path.join(__dirname, '..', 'src');

// Función para procesar un archivo
function processFile(filePath) {
  try {
    // Leer el contenido del archivo
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Usar una expresión regular para encontrar importaciones de @/lib/utils
    const newContent = content.replace(
      /import\s+{\s*cn\s*}\s+from\s+["']@\/lib\/utils["'];?/g,
      'import { cn } from "../lib/utils.js";'
    );
    
    // Si hubo cambios, escribir el nuevo contenido
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Actualizado: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error procesando ${filePath}:`, error);
  }
}

// Función para recorrer recursivamente directorios
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Si es un directorio, recorremos recursivamente
      walkDir(filePath);
    } else if (
      // Solo procesar archivos de JavaScript/TypeScript/React
      /\.(js|jsx|ts|tsx)$/.test(file)
    ) {
      processFile(filePath);
    }
  });
}

// Iniciar el procesamiento desde el directorio raíz
console.log('Iniciando corrección de importaciones...');
walkDir(rootDir);
console.log('Proceso completado.'); 