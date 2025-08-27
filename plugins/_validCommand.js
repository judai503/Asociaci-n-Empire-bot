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

    const now = Date.now();
    if (now - global.invalidCommandTime[m.sender] > 10000) {
      global.invalidCommandCount[m.sender] = 0;
    }

    if (!validCommand(command, global.plugins)) {
      global.invalidCommandCount[m.sender]++;
      global.invalidCommandTime[m.sender] = now;

      let aviso = '';
      const count = global.invalidCommandCount[m.sender];

      if (count === 3) {
        aviso = '⚠️ Has enviado 3 comandos inválidos seguidos. Revisa el menú.';
      } else if (count === 5) {
        aviso = '⚠️ Ya son 5 comandos inválidos. Mejor mira el menú completo.';
      } else if (count >= 7) {
        aviso = `❌ Comando *${command}* no existe.\nHas enviado 7 comandos inválidos seguidos, revisa el menú antes de seguir.`;
        global.invalidCommandCount[m.sender] = 0; // reiniciar
      }

      if (aviso) {
        await conn.sendMessage(m.chat, {
          text: aviso,
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
        }, { quoted: m });
      }

      return false; // no bloquear otros handlers
    }

    // Comando válido → reinicia contador
    global.invalidCommandCount[m.sender] = 0;

  } catch (error) {
    console.error(`Error en _validCommand.js: ${error}`);
  }

  return false;
}
