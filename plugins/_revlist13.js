let handler = async (m, { text, conn }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.');
  if (!text) return m.reply(`⚠️ Uso correcto:\n.revlist13 <emoji>\n\nEjemplo:\n.revlist13 ❄️`);

  let emoji = text.trim().split(/ +/)[0]; // emoji elegido

  const metadata = await conn.groupMetadata(m.chat);
  const groupName = metadata.subject;

  // Separar participantes y admins
  let participants = metadata.participants.filter(p => !p.admin);
  let admins = metadata.participants.filter(p => p.admin);

  if (participants.length === 0) return m.reply("⚠️ No hay participantes sin permisos para listar.");

  // Lista de integrantes con estados
  let listaIntegrantes = participants
    .map(p => `${emoji} @${p.id.split('@')[0]} ⌛✅❌🅿️🆕`)
    .join('\n');

  // Lista de administradores
  let listaAdmins = admins
    .map(a => `${emoji} @${a.id.split('@')[0]}`)
    .join('\n');

  // Mensaje final
  let mensaje = `
${emoji}${emoji} *${groupName}* ${emoji}${emoji}

*Total de integrantes: ${participants.length}*

𝐌𝐀𝐍𝐃𝐀𝐑𝐎𝐍 𝐄𝐕𝐈𝐃𝐄𝐍𝐂𝐈𝐀𝐒
•——————•°•${emoji}•°•——————•

${listaIntegrantes}

•——————•°•${emoji}•°•——————•
𝐃𝐄𝐁𝐄𝐍 𝐄𝐕𝐈𝐃𝐄𝐍𝐂𝐈𝐀

•——————•°•${emoji}•°•——————•
𝐏𝐄𝐑𝐌𝐈𝐒𝐎

•——————•°•${emoji}•°•——————•

*Admis*
${listaAdmins}
`;

  await conn.sendMessage(m.chat, {
    text: mensaje,
    mentions: [...participants.map(p => p.id), ...admins.map(a => a.id)]
  }, { quoted: m });
};

handler.command = /^revlist13$/i;
handler.tags = ['sociedades'];
handler.help = ['revlist13 <emoji>'];

export default handler;