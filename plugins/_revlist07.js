let handler = async (m, { text, conn }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.');
  if (!text) return m.reply(`⚠️ Uso correcto:\n.revlist7 <emoji>\n\nEjemplo:\n.revlist7 💛`);

  let emoji = text.trim().split(/ +/)[0];

  const metadata = await conn.groupMetadata(m.chat);
  const groupName = metadata.subject;

  // Filtrar participantes no administradores
  const participants = metadata.participants.filter(p => !p.admin && !p.isAdmin && !p.isSuperAdmin);
  const admins = metadata.participants.filter(p => p.admin || p.isAdmin || p.isSuperAdmin);

  if (participants.length === 0) return m.reply("⚠️ No hay participantes sin permisos para listar.");

  // Construir la lista
  let lista = '';
  for (let i = 0; i < participants.length; i++) {
    let userTag = '@' + participants[i].id.split('@')[0];
    lista += `${emoji} ${i + 1} ${userTag}\n   🅻. 🅼. 🅼. 🅹. 🆅\n-\n`;
  }

  // Pie con admins
  let adminMentions = admins.map(p => `       ${emoji}@${p.id.split('@')[0]} ${emoji}`).join('\n');

  let mensaje = 
`${emoji} ${groupName} ${emoji}
*Pueden subir link mis niñ@s* ${emoji}
*Integrantes:* ${participants.length}
*REACCIÓNES*:
*AL DÍA* ${emoji}
*PERMISOS* 🅿️
*ENTREGA TARDE* ⏳
*NO AL DÍA* ❌
*NUEVA INTEGRANTE* 🎊
*REINGRESO* 🆕
*SALIÓ DE TEAM* 💔
_____________________
${lista}_______________________
${emoji} *Administradoras* ${emoji}
${adminMentions}`;

  await conn.sendMessage(m.chat, { 
    text: mensaje, 
    mentions: [...participants.map(p => p.id), ...admins.map(p => p.id)]
  }, { quoted: m });
};

handler.command = /^revlist7$/i;
handler.tags = ['herramientas'];
handler.help = ['revlist7 <emoji>'];

export default handler;