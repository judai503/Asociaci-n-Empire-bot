/*
- Setkick By Angel-OFC
- Permite personalizar el mensaje de kick por grupo
*/

import fs from 'fs';
const FILE = './kickMessages.json';

// Función para cargar o crear JSON
const loadKickMessages = () => {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({}, null, 2));
  return JSON.parse(fs.readFileSync(FILE));
};

const saveKickMessages = (data) => {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
};

let handler = async (m, { conn, text, command }) => {
  if (command.toLowerCase() === 'setkick') {
    if (!text) return m.reply(`⚠️ Debes proporcionar el mensaje de kick.\nEjemplo: ${command} @user ha sido expulsado del grupo 💀`);

    // Asegurarnos que exista la data del grupo en JSON
    const data = loadKickMessages();
    data[m.chat] = { message: text };
    saveKickMessages(data);

    return m.reply(`✅ Mensaje de kick personalizado guardado correctamente para este grupo.\nRecuerda usar @user para mencionar al expulsado.`);
  }

  // ---------- Kick ----------
  if (/^(kick|echar|hechar|sacar|ban)$/i.test(command)) {
    if (!m.mentionedJid?.length && !m.quoted) return m.reply('❌ Menciona o responde a alguien para expulsar.');

    let user = m.mentionedJid?.[0] || m.quoted.sender;
    if (user === conn.user.jid) return m.reply('❌ No puedo expulsarme a mí mismo.');

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';
    if (user === ownerGroup || user === ownerBot) return m.reply('❌ No puedes expulsar al dueño del grupo ni al bot.');

    // Kick inmediato
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');

    // Mensaje dinámico
    const kickData = loadKickMessages();
    const kickMsg = kickData[m.chat]?.message
      ? kickData[m.chat].message.replace(/@user/g, `@${user.split('@')[0]}`)
      : `💀 @${user.split('@')[0]} ha sido expulsado del grupo.`;

    await conn.sendMessage(m.chat, { text: kickMsg, mentions: [user] }, { quoted: m });
  }
};

handler.help = ['setkick','kick'];
handler.tags = ['grupo'];
handler.command = ['setkick','kick','echar','hechar','sacar','ban'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
