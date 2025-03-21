// Script para iniciar el frontend y el backend en desarrollo
import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Función para ejecutar comandos
function runCommand(command, args, options = {}) {
  const proc = spawn(command, args, {
    ...options,
    stdio: 'inherit',
    shell: true,
    cwd: rootDir
  });

  proc.on('error', (error) => {
    console.error(`Error ejecutando ${command}:`, error.message);
  });

  return proc;
}

// Iniciar frontend (Vite)
console.log('Iniciando servidor de desarrollo frontend (Vite)...');
const frontendProc = runCommand('npm', ['run', 'dev']);

// Iniciar backend (Express)
console.log('Iniciando servidor de desarrollo backend...');
const backendProc = runCommand('node', ['server.js']);

// Manejar terminación
process.on('SIGINT', () => {
  console.log('Deteniendo servidores...');
  frontendProc.kill('SIGINT');
  backendProc.kill('SIGINT');
  process.exit(0);
});

console.log('\n🚀 Servicios iniciados:');
console.log('- Frontend: http://localhost:5173');
console.log('- Backend: http://localhost:3001/api');
console.log('\nPresiona Ctrl+C para detener ambos servidores.\n'); 