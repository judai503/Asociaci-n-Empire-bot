import fs from 'fs';
import path from 'path';

global.plugins = [];

// Cargar plugins automáticamente por carpetas
const pluginFolders = ['juegos', 'descargas', 'administracion', 'publicos'];
for (const folder of pluginFolders) {
  const folderPath = path.join('./plugins', folder);
  if (!fs.existsSync(folderPath)) continue;

  fs.readdirSync(folderPath).forEach(file => {
    if (!file.endsWith('.js')) return;
    const plugin = require(path.join(folderPath, file));
    global.plugins.push(plugin.default || plugin);
  });
}

// Función para manejar mensajes entrantes
export async function handleMessage(m, sendMessage) {
  const prefix = '.';
  const text = m.text?.trim();
  if (!text || !text.startsWith(prefix)) return;

  const args = text.slice(prefix.length).split(/\s+/); // reconoce espacios
  const command = args.shift().toLowerCase();

  for (let plugin of global.plugins) {
    if (plugin.command.includes(command)) {
      try {
        await plugin.handler(m, { args, text: args.join(' '), sendMessage });
      } catch (err) {
        console.error(`Error en plugin ${command}:`, err);
      }
      break;
    }
  }
}
