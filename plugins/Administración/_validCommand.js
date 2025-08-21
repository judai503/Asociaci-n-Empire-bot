export async function before(m, { conn }) {
  try {
    if (!m.text || !global.prefix || !global.prefix.test(m.text)) return false;

    const usedPrefix = global.prefix.exec(m.text)[0];
    const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();
    if (!command) return false;

    const validCommand = (cmd, plugins) => {
      if (!plugins) return false;
      return Object.values(plugins).some(plugin =>
        plugin && plugin.command &&
        (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(cmd)
      );
    };

    if (!global.invalidCommandCount) global.invalidCommandCount = {};
    if (!global.invalidCommandTime) global.invalidCommandTime = {};
    if (!global.invalidCommandCount[m.sender]) global.invalidCommandCount[m.sender] = 0;
    if (!global.invalidCommandTime[m.sender]) global.invalidCommandTime[m.sender] = 0;

    // Verificar tiempo desde el último comando inválido
    const now = Date.now();
    if (now - global.invalidCommandTime[m.sender] > 10000) { // más de 10s
      global.invalidCommandCount[m.sender] = 0; // reiniciar contador
    }

    if (!validCommand(command, global.plugins)) {
      global.invalidCommandCount[m.sender]++;
      global.invalidCommandTime[m.sender] = now; // actualizar tiempo del último comando inválido

      // Solo avisa cuando llegue a 7 fallos seguidos
      if (global.invalidCommandCount[m.sender] >= 7) {
        global.invalidCommandCount[m.sender] = 0; // reiniciar contador
        await conn.sendMessage(m.chat, {
          text: `❌ El comando *${command}* no existe.\n\n✨ Has enviado 7 comandos inválidos seguidos, revisa el menú antes de seguir.`,
          contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
              title: 'Comando inválido',
              body: 'JUDAI MOD',
              mediaType: 2,
              thumbnailUrl: 'https://files.cloudkuimages.guru/images/HUmjMRt8.jpg',
              sourceUrl: 'https://www.tiktok.com/@sandrabot_md'
            }
          }
        }, { quoted: global.fakeMetaMsg });
      }

      return false; // No bloquear otros handlers
    }

    // Si es válido, reinicia el contador
    global.invalidCommandCount[m.sender] = 0;

  } catch (error) {
    console.error(`Error en _validCommand.js: ${error}`);
  }

  return false; // siempre permitir otros handlers
}