const handler = async (m, { conn, participants, usedPrefix, command }) => {
  const emoji = '💀'; // Reacción de calavera

  if (!m.mentionedJid[0] && !m.quoted) {
    return conn.reply(m.chat, `
┌──「 *Expulsión Fallida* 」
│ 🌸 Debes mencionar a alguien para expulsar.
└───────❖`, m, fake)
  }

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
  const groupInfo = await conn.groupMetadata(m.chat);
  const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
  const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

  if (user === conn.user.jid || user === ownerGroup || user === ownerBot) return;

  // Reacción de calavera
  await m.react(emoji).catch(() => null);

  // Expulsa al usuario
  await conn.groupParticipantsUpdate(m.chat, [user], 'remove');

  // Chequear si welcome maneja la notificación
  const welcomeNotifica = global.db.data.groups[m.chat]?.welcome || false;
  if (!welcomeNotifica) {
    conn.reply(m.chat, `
╭─❖ 「 *Usuario Expulsado* 」 ❖─
│ 💀 El miembro ha sido expulsado.
╰─────────────❖`, m, fake);
  }
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick','echar','hechar','sacar','ban'];
handler.admin = true;
handler.group = true;
handler.register = true;
handler.botAdmin = true;

export default handler;