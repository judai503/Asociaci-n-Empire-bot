let handler = async (m, { text, conn }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.');
  if (!text) return m.reply(`⚠️ Uso correcto:\n.revlist12 <emoji>\n\nEjemplo:\n.revlist12 🍒`);

  let emoji = text.trim().split(/ +/)[0]; // emoji elegido

  const metadata = await conn.groupMetadata(m.chat);
  const groupName = metadata.subject;

  // Separar participantes y admins
  let participants = metadata.participants.filter(p => !p.admin);
  let admins = metadata.participants.filter(p => p.admin);

  if (participants.length === 0) return m.reply("⚠️ No hay participantes sin permisos para listar.");

  // Lista de integrantes con ✅❌🆕⏱️🅿️
  let listaIntegrantes = participants
    .map(p => `${emoji}| @${p.id.split('@')[0]} ✅❌🆕⏱️🅿️`)
    .join('\n');

  // Lista de administradores
  let listaAdmins = admins
    .map(a => `${emoji}| @${a.id.split('@')[0]}`)
    .join('\n');

  // Mensaje final
  let mensaje = `
${emoji} *MIS PEQUEÑ@S DIA*  ${emoji}

💗 (${groupName})💗

👥 Integrantes: ${participants.length}

•.•.•.•.•.•.•.•.•${emoji}•.•.•.•.•.•.•.•.•

${listaIntegrantes}

•.•.•.•.•.•.•.•.•${emoji}•.•.•.•.•.•.•.•.•

❌ No al día ❌

•.•.•.•.•.•.•.•.•${emoji}•.•.•.•.•.•.•.•.•

🆕🫂 Nuevos & reingresos 🫂🆕

•.•.•.•.•.•.•.•.•${emoji}•.•.•.•.•.•.•.•.•

⏱️🅿️ Permisos & entregas tarde 🅿️⏱️

•.•.•.•.•.•.•.•.•${emoji}•.•.•.•.•.•.•.•.•

✨️ *Admis* ✨️
${listaAdmins}
`;

  await conn.sendMessage(m.chat, {
    text: mensaje,
    mentions: [...participants.map(p => p.id), ...admins.map(a => a.id)]
  }, { quoted: m });
};

handler.command = /^revlist12$/i;
handler.tags = ['herramientas'];
handler.help = ['revlist12 <emoji>'];

export default handler;