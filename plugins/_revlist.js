let handler = async (m, { text, conn }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.');
  if (!text) return m.reply(`⚠️ Uso correcto:\n.revlist <emoji>\n\nEjemplo:\n.revlist 🔥`);

  let emoji = text.trim().split(/ +/)[0];
  const metadata = await conn.groupMetadata(m.chat);
  const groupName = metadata.subject;

  // Participantes que no son administradores
  const participants = metadata.participants.filter(p => !p.admin && !p.isAdmin && !p.isSuperAdmin);

  if (participants.length === 0) return m.reply("⚠️ No hay participantes sin permisos para listar.");

  // Construcción de la lista
  let lista = '';
  for (let i = 0; i < participants.length; i++) {
    let userTag = '@' + participants[i].id.split('@')[0];
    lista += `${i + 1}. ${emoji} ${userTag}\n    .🅛 .🅜.🅜.🅙.🅥\n* \n`;
  }

  // Pie con administradores
  let admins = metadata.participants.filter(p => p.admin || p.isAdmin || p.isSuperAdmin);
  let adminMentions = admins.map(p => '@' + p.id.split('@')[0]).join('\n');

  let texto = `*Lista de  ${groupName}*\n
*🅿️ PERMISO: 0*
*🕑 P. Entregar tarde: 0*
*❌ No al día: 0*
*🆕 Ingresos y reingresos : 0*
*🚻 Integrantes: ${participants.length}*
*${emoji} Reacciones: 0*
•••••••••••••••••••••••••••••••••••

${lista}

•••••••••••••••••••••••••••••••••••
*Administradores*
${adminMentions}

`;

  await conn.sendMessage(m.chat, { 
    text: texto,
    mentions: [...participants.map(p => p.id), ...admins.map(p => p.id)]
  }, { quoted: m });
};

handler.command = /^revlist$/i;
handler.tags = ['herramientas'];
handler.help = ['revlist <emoji>'];

export default handler;