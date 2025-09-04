let handler = async (m, { conn, text }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.');
  if (!text) return m.reply('⚠️ Usa el comando así: .revlist6 <emoji>\nEjemplo: .revlist6 🌺');

  const emoji = text.trim();
  const metadata = await conn.groupMetadata(m.chat);
  const groupName = metadata.subject || 'Grupo';

  // Separar miembros normales y admins
  const members = metadata.participants.filter(p => !p.admin && !p.isAdmin && !p.isSuperAdmin);
  const admis = metadata.participants.filter(p => p.admin || p.isAdmin || p.isSuperAdmin);

  // Simulación: usar primeros 3 miembros normales como "al día"
  let usersAlDia = members.slice(0, 3);

  // Centrar nombre del grupo (ancho aprox 30)
  const nombreCentrado = centerText(`(${groupName})`, 30);

  // Armar el cuerpo sin líneas extra
  let body = `*${nombreCentrado}*\n*Mis pequeños al día*\n╒═${emoji}═${emoji}═${emoji}═${emoji}═╕`;
  let counter = 1;

  for (let user of usersAlDia) {
    let userTag = '@' + user.id.split('@')[0];
    body += `\n${emoji}${counter}. ${userTag}\n╞   .Ⓛ.ⓜ.ⓜ.ⓙ.ⓥ\n🇪.\n🇷`;
    counter++;
  }
  body += `\n╘═${emoji}═${emoji}═${emoji}═${emoji}═╛\n⚜️⚜️⚜️⚜️⚜️\n${emoji} *admis a cargo* ${emoji}`;

  for (let adm of admis) {
    let admTag = '@' + adm.id.split('@')[0];
    body += `\n${admTag}`;
  }

  // Mencionar solo a miembros al día y admins
  await conn.sendMessage(m.chat, { text: body, mentions: [...usersAlDia.map(u => u.id), ...admis.map(a => a.id)] }, { quoted: m });
};

// Función para centrar texto en un ancho fijo (aprox)
function centerText(text, width) {
  let len = text.length;
  if (len >= width) return text;
  let left = Math.floor((width - len) / 2);
  let right = width - len - left;
  return ' '.repeat(left) + text + ' '.repeat(right);
}

handler.command = /^revlist6$/i;
handler.tags = ['herramientas'];
handler.help = ['revlist6 <emoji>'];

export default handler;