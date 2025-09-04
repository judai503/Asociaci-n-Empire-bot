let handler = async (m, { text, conn }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.');
  if (!text) return m.reply(`⚠️ Uso correcto:\n.revlist4 <emoji>\n\nEjemplo:\n.revlist4 🍏`);

  let emoji = text.trim().split(/ +/)[0];
  const metadata = await conn.groupMetadata(m.chat);
  const groupName = metadata.subject;

  // Participantes que no son admins
  let participants = metadata.participants.filter(p => !p.admin && !p.isAdmin && !p.isSuperAdmin);
  if (participants.length === 0) return m.reply("⚠️ No hay participantes sin permisos para listar.");

  // Limitar a 100 participantes
  if (participants.length > 100) participants = participants.slice(0, 100);

  // Números estilizados para enumeración
  const numeros = ['¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹','¹⁰',
                   '¹¹','¹²','¹³','¹⁴','¹⁵','¹⁶','¹⁷','¹⁸','¹⁹','²⁰',
                   '²¹','²²','²³','²⁴','²⁵','²⁶','²⁷','²⁸','²⁹','³⁰',
                   '³¹','³²','³³','³⁴','³⁵','³⁶','³⁷','³⁸','³⁹','⁴⁰',
                   '⁴¹','⁴²','⁴³','⁴⁴','⁴⁵','⁴⁶','⁴⁷','⁴⁸','⁴⁹','⁵⁰'];

  // Construir la lista de participantes
  let lista = '';
  for (let i = 0; i < participants.length; i++) {
    let userTag = '@' + participants[i].id.split('@')[0];
    let numero = numeros[i] || (i + 1); // Si hay más de 50, usa número normal
    lista += `${emoji}▏${numero} ${userTag}\n${emoji}▏ 𝕷┊𝕸┊𝕸.┊𝕵┊𝖁\n${emoji}▏\n`;
  }

  // Administradores
  let admins = metadata.participants.filter(p => p.admin || p.isAdmin || p.isSuperAdmin);
  let adminMentions = admins.map(p => `${emoji}@${p.id.split('@')[0]}`).join('\n');

  // Texto final
  let texto = `${emoji.repeat(2)} *${groupName}* ${emoji.repeat(2)}\n\n` +
              `* *𝕽𝖊𝖘𝖕𝖔𝖓𝖘𝖆𝖇𝖑𝖊𝖘✅*\n` +
              `* *𝕾𝖎𝖓 𝖊𝖛𝖎𝖉𝖊𝖓𝖈𝖎𝖆❌*\n` +
              `* *𝕹𝖚𝖊𝖛𝖔𝖘 & 𝖗𝖊𝖎𝖓𝖌𝖗𝖊𝖘𝖔𝖘🆕*\n` +
              `* *𝕻𝖊𝖗𝖒𝖎𝖘𝖔𝖘🅿️*\n` +
              `* *𝕰𝖓𝖙𝖗𝖊𝖌𝖆 𝕿𝖆𝖗𝖉𝖊⏱️*\n\n` +
              ` ╓———————————╖\n` +
              `${emoji}≡≡≡${emoji}≡≡≡${emoji}≡≡≡${emoji}\n` +
              lista +
              `${emoji}≡≡≡${emoji}≡≡≡${emoji}≡≡≡${emoji}\n\n` +
              `*𝕬𝖉𝖒𝖎𝖓𝖎𝖘𝖙𝖗𝖆𝖉𝖔𝖗𝖊𝖘*\n` +
              `${adminMentions}`;

  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: [...participants.map(p => p.id), ...admins.map(p => p.id)]
  }, { quoted: m });
};

handler.command = /^revlist4$/i;
handler.tags = ['herramientas'];
handler.help = ['revlist4 <emoji>'];

export default handler;