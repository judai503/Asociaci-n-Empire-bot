import { readdirSync } from 'fs';
import path from 'path';

// Prefijo de comandos
const PREFIX = '.';

// Carpeta principal de plugins
const PLUGINS_FOLDER = './plugins';

// Estructura de carpetas de tu bot
const CATEGORIES = ['Juegos', 'Descargas', 'Administración', 'Públicos'];

// Función para cargar todos los comandos
global.commands = new Map();

function loadPlugins() {
  for (const category of CATEGORIES) {
    const folderPath = path.join(PLUGINS_FOLDER, category);
    try {
      const files = readdirSync(folderPath).filter(f => f.endsWith('.js'));
      for (const file of files) {
        const plugin = await import(`${folderPath}/${file}`);
        if (plugin && plugin.default) {
          const cmdName = plugin.default.name || file.replace('.js', '');
          const aliases = plugin.default.aliases || [];
          global.commands.set(cmdName, plugin.default);
          for (const alias of aliases) {
            global.commands.set(alias, plugin.default);
          }
        }
      }
    } catch (err) {
      console.log(`Error cargando plugins de ${category}: ${err}`);
    }
  }
}

// Llamar a la función al iniciar
await loadPlugins();

// Función principal para ejecutar comandos
export async function handleMessage(m, client) {
  if (!m.message) return;
  const text = m.message?.conversation || m.message?.extendedTextMessage?.text;
  if (!text || !text.startsWith(PREFIX)) return;

  const args = text.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = global.commands.get(commandName);
  if (!command) return;

  // Verificación de permisos
  const isOwner = global.owner.some(o => o[0] === m.sender);
  const isMod = global.mods.includes(m.sender);
  const isPremium = global.prems.includes(m.sender);

  if (command.owner && !isOwner) return m.reply('⚠️ Solo para el propietario.');
  if (command.mods && !isMod) return m.reply('⚠️ Solo para moderadores.');
  if (command.premium && !isPremium) return m.reply('⚠️ Solo para usuarios premium.');

  try {
    await command.run(client, m, args);
  } catch (err) {
    console.error(err);
    m.reply('❌ Ocurrió un error ejecutando el comando.');
  }
}
