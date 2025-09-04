let handler = async (m, { text, conn }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.');
  if (!text) return m.reply(`⚠️ Uso correcto:\n.revlist3 <emoji>\n\nEjemplo:\n.revlist3 🍇`);

  let emoji = text.trim().split(/ +/)[0];
  const metadata = await conn.groupMetadata(m.chat);
  const groupName = metadata.subject;

  // Participantes que NO son administradores
  let participants = metadata.participants.filter(p => !p.admin && !p.isAdmin && !p.isSuperAdmin);
  if (participants.length === 0) return m.reply("⚠️ No hay participantes sin permisos para listar.");

  // Limitar máximo 100 participantes
  if (participants.length > 100) participants = participants.slice(0, 100);

  // Función para generar números estilizados
  const getNumeroEstilizado = (i) => {
    const numeros = ['➊','➋','➌','➍','➎','➏','➐','➑','➒','➓'];
    if (i < 10) return numeros[i];
    // Para >10: combinar dos caracteres
    const decenas = Math.floor(i / 10);
    const unidades = i % 10;
    const extra = ['⓿','➊','➋','➌','➍','➎','➏','➐','➑','➒','➓'];
    return extra[decenas] + extra[unidades];
  };

  // Construir lista de participantes
  let lista = '';
  for (let i = 0; i < participants.length; i++) {
    let userTag = '@' + participants[i].id.split('@')[0];
    let numero = getNumeroEstilizado(i);
    lista += `${numero} ${userTag} ${emoji}\n🄻 🄼 🄼 .🄹 🅅\n\n`;
  }

  // Administradores
  let admins = metadata.participants.filter(p => p.admin || p.isAdmin || p.isSuperAdmin);
  let adminMentions = admins.map(p => `${emoji}@${p.id.split('@')[0]}`).join('\n');

  // Texto final
  let texto = `${emoji} ${groupName} ${emoji}\n` +
              `⭐ 𝐀𝐋 𝐃𝐈́𝐀\n` +
              `🄻🄼🄼🄹🅅\n` +
              `❌ 𝐍𝐎 𝐀𝐋 𝐃𝐈́𝐀\n` +
              `🆕 𝐍𝐔𝐄𝐕𝐎𝐒\n` +
              `🅿️ 𝐏𝐄𝐑𝐌𝐈𝐒𝐎𝐒\n` +
              `🆕 𝐑𝐄𝐈𝐍𝐆𝐑𝐄𝐒𝐎𝐒\n` +
              `⏱️ 𝐄𝐕𝐈𝐃𝐄𝐍𝐂𝐈𝐀𝐒 𝐌𝐀𝐒 𝐓𝐀𝐑𝐃𝐄\n` +
              `⭐ 𝐄𝐕𝐈𝐃𝐄𝐍𝐂𝐈𝐀𝐒 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀\n` +
              `•━━━━━━━━━${emoji}━━━━━━━━━•\n\n` +
              lista +
              `•━━━━━━━━━${emoji}━━━━━━━━━•\n\n` +
              `*ADM A CARGO*\n${adminMentions}`;

  await conn.sendMessage(m.chat, { 
    text: texto,
    mentions: [...participants.map(p => p.id), ...admins.map(p => p.id)]
  }, { quoted: m });
};

handler.command = /^revlist3$/i;
handler.tags = ['herramientas'];
handler.help = ['revlist3 <emoji>'];

export default handler;