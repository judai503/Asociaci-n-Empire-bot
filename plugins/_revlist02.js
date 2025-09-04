let handler = async (m, { text, conn }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.');
  if (!text) return m.reply(`⚠️ Uso correcto:\n.revlist2 <emoji>\n\nEjemplo:\n.revlist2 🍥`);

  let emoji = text.trim().split(/ +/)[0];
  const metadata = await conn.groupMetadata(m.chat);
  const groupName = metadata.subject;

  // Participantes que no son administradores
  let participants = metadata.participants.filter(p => !p.admin && !p.isAdmin && !p.isSuperAdmin);

  if (participants.length === 0) return m.reply("⚠️ No hay participantes sin permisos para listar.");

  // Limitar a máximo 100 participantes
  if (participants.length > 100) participants = participants.slice(0, 100);

  // Función para generar números estilizados
  const getNumeroEstilizado = (i) => {
    const circulos = ['❶','❷','❸','❹','❺','❻','❼','❽','❾','❶⓿'];
    if (i < 10) return circulos[i];
    // Para >10: se combinan los caracteres
    const decenas = Math.floor(i / 10);
    const unidades = i % 10;
    const circulosExtra = ['❶','❷','❸','❹','❺','❻','❼','❽','❾','⓿'];
    return circulosExtra[decenas - 1] + circulosExtra[unidades];
  };

  // Construir lista de participantes
  let lista = '';
  for (let i = 0; i < participants.length; i++) {
    let userTag = '@' + participants[i].id.split('@')[0];
    let numero = getNumeroEstilizado(i);
    lista += `${numero} ${userTag}\n🅻.🅼.🅼.🅹.🆅\n\n`;
  }

  // Administradores
  let admins = metadata.participants.filter(p => p.admin || p.isAdmin || p.isSuperAdmin);
  let adminMentions = admins.map(p => '@' + p.id.split('@')[0]).join('\n');

  let pie = `_______________\n*ADM acargo*\n${adminMentions}`;

  // Texto final
  let texto = `${emoji} ${groupName} ${emoji}\n\n` +
              `      ${emoji} ɆVłĐɆ₦₵ł₳₴ ${emoji}\n\n` +
              `*ᴀʟ ᴅíᴀ ${emoji}*\n` +
              `*ɴᴏ ᴀʟ ᴅíᴀ ❌*\n` +
              `*ᴘᴇʀᴍɪꜱᴏ 🅿️*\n` +
              `*ᴇɴᴛʀᴇɢᴀ ᴛᴀʀᴅᴇ ⏱️*\n` +
              `*ɪɴɢʀᴇꜱᴏ ʏ ʀᴇɪɴɢʀᴇꜱᴏ 🆕*\n\n` +
              `      ${emoji} 𝕀ℕ𝕋𝔼𝔾ℝ𝔸ℕ𝕋𝔼𝕊 ${emoji}\n\n` +
              lista +
              pie;

  await conn.sendMessage(m.chat, { 
    text: texto,
    mentions: [...participants.map(p => p.id), ...admins.map(p => p.id)]
  }, { quoted: m });
};

handler.command = /^revlist2$/i;
handler.tags = ['herramientas'];
handler.help = ['revlist2 <emoji>'];

export default handler;