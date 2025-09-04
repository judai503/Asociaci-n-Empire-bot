let handler = async (m, { args, conn }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.');

  // Emoji elegido por usuario o por defecto ⚔️
  const emojiInput = args[0] || '⚔️';

  const metadata = await conn.groupMetadata(m.chat);
  const groupName = metadata.subject;

  // Días abreviados con estilo gótico
  const dias = ['𝕷', '𝕸', '𝕸', '𝕵', '𝖁'];

  // Separar admins y no admins
  const admins = metadata.participants.filter(p => p.admin || p.isAdmin || p.isSuperAdmin);
  const noAdmins = metadata.participants.filter(p => !p.admin && !p.isAdmin && !p.isSuperAdmin);

  // Lista de miembros
  let lista = '';
  noAdmins.forEach((p, i) => {
    let userTag = '@' + p.id.split('@')[0];
    lista += `#${i + 1} ${userTag} ${emojiInput}\n      ${dias.join('..')}\n* \n`;
  });

  // Lista admins
  const listaAdmins = admins.map(p => ` [@${p.id.split('@')[0]}]`).join('\n');

  // Texto final armado
  let texto = `
█████████████████
   *${groupName.toUpperCase()}*
█████████████████

* *𝕽𝖊𝖘𝖕𝖔𝖓𝖘𝖆𝖇𝖑𝖊𝖘✅*
* *𝕾𝖎𝖓 𝖊𝖛𝖎𝖉𝖊𝖓𝖈𝖎𝖆❌*
* *𝕹𝖚𝖊𝖛𝖔𝖘 & 𝖗𝖊𝖎𝖓𝖌𝖗𝖊𝖘𝖔𝖘🆕*
* *𝕻𝖊𝖗𝖒𝖎𝖘𝖔𝖘🅿️*
* *𝕰𝖓𝖙𝖗𝖊𝖌𝖆 𝕿𝖆𝖗𝖉𝖊⏱️*

████ LISTA ████
${lista.trim()}

*𝕿𝖔𝖙𝖆𝖑: ${noAdmins.length}*

███████████████

*𝕬𝖉𝖒𝖎𝖓𝖎𝖘𝖙𝖗𝖆𝖉𝖔𝖗𝖊𝖘*
${listaAdmins}
`.trim();

  await conn.sendMessage(m.chat, { 
    text: texto, 
    mentions: [...admins.map(a => a.id), ...noAdmins.map(n => n.id)] 
  }, { quoted: m });
};

handler.command = /^revlist5$/i;
handler.tags = ['herramientas'];
handler.help = ['revlist5 <emoji>'];

export default handler;