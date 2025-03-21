// Script para corregir las importaciones en todos los archivos
import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const srcDir = join(rootDir, 'src');

// Patrón a buscar y reemplazar
const searchPattern = /import\s+\{\s*cn\s*\}\s+from\s+["']\.\.\/lib\/utils\.js["'];/g;
const replacement = 'import { cn } from "@/lib/utils.js";';

// Lista de archivos procesados
const processedFiles = [];

// Función recursiva para procesar directorios
async function processDirectory(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Procesar subdirectorio recursivamente
      await processDirectory(fullPath);
    } else if (entry.isFile() && /\.(jsx|js|tsx|ts)$/.test(entry.name)) {
      // Procesar archivo
      await processFile(fullPath);
    }
  }
}

// Función para procesar un archivo
async function processFile(filePath) {
  try {
    // Leer el contenido del archivo
    const content = await readFile(filePath, 'utf8');
    
    // Verificar si contiene el patrón que buscamos
    if (searchPattern.test(content)) {
      // Reemplazar todas las ocurrencias
      const updatedContent = content.replace(searchPattern, replacement);
      
      // Escribir el archivo actualizado
      await writeFile(filePath, updatedContent, 'utf8');
      
      // Registrar el archivo procesado
      processedFiles.push(filePath);
      console.log(`Actualizado: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error procesando ${filePath}:`, error.message);
  }
}

// Función principal
async function main() {
  console.log('Iniciando actualización de importaciones...');
  
  try {
    // Procesar el directorio src
    await processDirectory(srcDir);
    
    if (processedFiles.length > 0) {
      console.log(`\n✅ Actualización completada. ${processedFiles.length} archivos fueron actualizados.`);
    } else {
      console.log('\n⚠️ No se encontraron archivos para actualizar.');
    }
  } catch (error) {
    console.error('Error durante la actualización:', error);
    process.exit(1);
  }
}

// Ejecutar función principal
main(); 