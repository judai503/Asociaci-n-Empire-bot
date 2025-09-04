let handler = async (m, { text, conn }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.');
  if (!text) return m.reply(`⚠️ Uso correcto:\n.revlist1 <emoji>\n\nEjemplo:\n.revlist1 🍏`);

  let emoji = text.trim().split(/ +/)[0];

  const metadata = await conn.groupMetadata(m.chat);
  const groupName = metadata.subject;

  let admins = metadata.participants.filter(p => p.admin || p.isAdmin || p.isSuperAdmin);
  let members = metadata.participants.filter(p => !p.admin && !p.isAdmin && !p.isSuperAdmin);

  if (members.length > 100) members = members.slice(0, 100);

  const notUpToDateCount = 10; // Primeros 10 miembros no al día
  const membersStatus = members.map((p, i) => ({
    id: p.id,
    upToDate: i >= notUpToDateCount
  }));

  let lista = '';
  membersStatus.forEach((p, i) => {
    let userTag = '@' + p.id.split('@')[0];
    let num = i + 1;
    let emojiLine = p.upToDate ? `${emoji}${emoji}${emoji}${emoji}${emoji}` : '';
    lista += `${emoji}${num}. ${userTag}\n╠   .Ⓛ .ⓜ.ⓜ.ⓙ. ⓥ\n🇪 .${emojiLine}\n`;
  });

  let adminList = admins.map(p => `${emoji} @${p.id.split('@')[0]}`).join('\n');

  let finalMessage = `ᴀʟ ᴅíᴀ ${emoji}:\nɴᴏ ᴀʟ ᴅíᴀ ❌:\nᴇɴᴛʀᴇɢᴀ ᴛᴀʀᴅᴇ ⏱️:\nɴᴜᴇᴠᴏ & ʀᴇɪɴɢʀᴇꜱᴏ 🆕:\nᴘᴇʀᴍɪꜱᴏ 🅿️:\n\n${emoji}${emoji} ${groupName} ${emoji}${emoji}\n\nʟɪꜱᴛᴀ ᴅᴇ ɪɴᴛᴇɢʀᴀɴᴛᴇꜱ\n╔════════${emoji}════════╗\n${lista}╚════════${emoji}════════╝\n\nTotal de integrantes: ${members.length}\n\n${emoji}__\nᴀᴅᴍɪꜱ ᴇɴᴄᴀʀɢᴀᴅᴏꜱ\n${adminList}`;

  await conn.sendMessage(m.chat, { text: finalMessage, mentions: [...members.map(p => p.id), ...admins.map(p => p.id)] }, { quoted: m });
};

handler.command = /^revlist1$/i;
handler.tags = ['herramientas'];
handler.help = ['revlist1 <emoji>'];

export default handler;