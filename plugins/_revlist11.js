let handler = async (m, { args, conn }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.');

  // Emoji elegido por usuario o por defecto 🥀
  const emojiInput = args[0] || '🥀';

  const metadata = await conn.groupMetadata(m.chat);
  const groupName = metadata.subject;

  // Días de la semana en español con emojis
  const dias = [
    { nombre: 'Domingo', emoji: '🧡', letra: 'D' },
    { nombre: 'Lunes', emoji: '🩷', letra: 'L' },
    { nombre: 'Martes', emoji: '💜', letra: 'M' },
    { nombre: 'Miércoles', emoji: '💙', letra: 'M' },
    { nombre: 'Jueves', emoji: '🩵', letra: 'J' },
    { nombre: 'Viernes', emoji: '🩶', letra: 'V' },
    { nombre: 'Sábado', emoji: '❤️', letra: 'S' },
  ];
  const hoyNum = new Date().getDay();
  const diaHoy = dias[hoyNum];

  // Función para centrar texto en 33 caracteres aprox
  function centrar(texto) {
    const width = 33;
    const len = texto.length;
    if (len >= width) return texto;
    const espacios = Math.floor((width - len) / 2);
    return ' '.repeat(espacios) + texto;
  }

  // Separar admins y no admins
  const admins = metadata.participants.filter(p => p.admin || p.isAdmin || p.isSuperAdmin);
  const noAdmins = metadata.participants.filter(p => !p.admin && !p.isAdmin && !p.isSuperAdmin);

  // Construir lista admins
  const listaAdmins = admins.map(p => '@' + p.id.split('@')[0]).join('\n');

  // Construir lista al día (para todos los no admins)
  let alDiaText = '';
  noAdmins.forEach((p, i) => {
    let userTag = '@' + p.id.split('@')[0];
    alDiaText += `┃${i + 1}. ${diaHoy.emoji} ${userTag} ✅❌⏱️🆕🅿️\n`;
  });

  // Leyenda días al final
  const diasLeyenda = dias.slice(1,6).map(d => `${d.letra} ${d.emoji}`).join('   ');

  // Texto final armado
  let texto = `
${emojiInput} ${centrar(groupName)} ${emojiInput}

${diaHoy.emoji} ${centrar('Personitas al día')} ${diaHoy.emoji}
${' '.repeat(16)}${diaHoy.emoji} ${diaHoy.nombre} ${diaHoy.emoji}

*Al día ✅*
*No al día ❌*
*Permiso 🅿️*
*Ingreso y reingreso 🆕*
*Entrega tarde ⏱️*
⌌━━━━━${emojiInput}━━━━━⌍
${alDiaText.trim()}
⌎━━━━━${emojiInput}━━━━━⌏

*Total de miembros:* ${noAdmins.length}

${emojiInput.repeat(8)}

*Encargados*
${listaAdmins}
${emojiInput.repeat(8)}

${diasLeyenda}
`.trim();

  await conn.sendMessage(m.chat, { text: texto, mentions: [...admins.map(a => a.id), ...noAdmins.map(n => n.id)] }, { quoted: m });
};

handler.command = /^revlist11$/i;
handler.tags = ['herramientas'];
handler.help = ['revlist11 <emoji>'];

export default handler;