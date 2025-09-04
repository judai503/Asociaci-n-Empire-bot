let handler = async (m, { text, conn }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.');
  if (!text) return m.reply(`⚠️ Uso correcto:\n.revlist9 <emoji>\n\nEjemplo:\n.revlist9 🟡`);

  let emoji = text.trim().split(/ +/)[0];
  const metadata = await conn.groupMetadata(m.chat);
  const groupName = metadata.subject;

  // Participantes que no son admins
  let participants = metadata.participants.filter(p => !p.admin && !p.isAdmin && !p.isSuperAdmin);
  if (!participants.length) return m.reply("⚠️ No hay participantes sin permisos para listar.");

  if (participants.length > 100) participants = participants.slice(0, 100);

  // Números estilizados para enumeración
  const numeros = [
    '¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹','¹⁰',
    '¹¹','¹²','¹³','¹⁴','¹⁵','¹⁶','¹⁷','¹⁸','¹⁹','²⁰',
    '²¹','²²','²³','²⁴','²⁵','²⁶','²⁷','²⁸','²⁹','³⁰',
    '³¹','³²','³³','³⁴','³⁵','³⁶','³⁷','³⁸','³⁹','⁴⁰',
    '⁴¹','⁴²','⁴³','⁴⁴','⁴⁵','⁴⁶','⁴⁷','⁴⁸','⁴⁹','⁵⁰',
    '⁵¹','⁵²','⁵³','⁵⁴','⁵⁵','⁵⁶','⁵⁷','⁵⁸','⁵⁹','⁶⁰',
    '⁶¹','⁶²','⁶³','⁶⁴','⁶⁵','⁶⁶','⁶⁷','⁶⁸','⁶⁹','⁷⁰',
    '⁷¹','⁷²','⁷³','⁷⁴','⁷⁵','⁷⁶','⁷⁷','⁷⁸','⁷⁹','⁸⁰',
    '⁸¹','⁸²','⁸³','⁸⁴','⁸⁵','⁸⁶','⁸⁷','⁸⁸','⁸⁹','⁹⁰',
    '⁹¹','⁹²','⁹³','⁹⁴','⁹⁵','⁹⁶','⁹⁷','⁹⁸','⁹⁹','¹⁰⁰'
  ];

  // Construir lista de participantes
  let lista = '';
  for (let i = 0; i < participants.length; i++) {
    let userTag = '@' + participants[i].id.split('@')[0];
    let numero = numeros[i] || (i + 1);
    lista += `${emoji} ${numero} ${userTag}\n🅴★\n🆁★\n\n`;
  }

  // Administradores
  let admins = metadata.participants.filter(p => p.admin || p.isAdmin || p.isSuperAdmin);
  let adminMentions = admins.map(p => `${emoji} @${p.id.split('@')[0]}`).join('\n');

  let texto = 
`❌ 𝑵𝒐 𝒂𝒍 𝒅𝒊́𝒂
✅ 𝑹𝒆𝒂𝒄𝒄𝒊𝒐́𝒏
🅿️ 𝑷𝒆𝒓𝒎𝒊𝚂𝒐
🆕 𝑵𝒖𝒆𝒗𝒐
⌛ 𝑴𝒂́𝒔 𝒕𝒂𝒓𝒅𝒂𝒓


┌──❀̥˚──◌─${groupName}─◌──❀̥˚─┐

✎✎✎✎✎✎𝑴𝒊𝒔 𝑵𝒊𝒏̃𝒐𝒔✎✎✎✎✎✎
⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱

${lista}⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱⋱

•━━━━━━━━━━━━🫧━━━━━━━━━━━━━•
✍︎𝙽𝙾 𝚂𝚄𝙱𝙴 𝙻𝙸𝙽𝙺  
✍︎𝙿𝙴𝚁𝙼𝙸𝚂𝙾
•━━━━━━━━━━━━🫧━━━━━━━━━━━━━•

${adminMentions}
`;

  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: [...participants.map(p => p.id), ...admins.map(p => p.id)]
  }, { quoted: m });
};

handler.command = /^revlist9$/i;
handler.tags = ['herramientas'];
handler.help = ['revlist9 <emoji>'];

export default handler;