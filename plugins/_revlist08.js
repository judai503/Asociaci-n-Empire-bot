let handler = async (m, { text, conn }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.');
  if (!text) return m.reply(`⚠️ Uso correcto:\n.revlist8 <emoji>\n\nEjemplo:\n.revlist8 🐢`);

  let emoji = text.trim().split(/ +/)[0]; // emoji elegido

  const metadata = await conn.groupMetadata(m.chat);

  // Separar miembros y admins
  const members = metadata.participants.filter(p => !p.admin); 
  const admins = metadata.participants.filter(p => p.admin);

  if (members.length === 0) return m.reply("⚠️ No hay miembros en el grupo.");

  // Lista de revisión numerada para miembros
  let listaRevision = members
    .map((p, i) => `${i + 1}️⃣❥︎@${p.id.split('@')[0]} ${emoji}\n🄻 🄼 🄼 🄹 🅅\n»»»»»»»»»»»»»»»»»»»»»»»»»»»»»`)
    .join('\n\n');

  // Lista de admins (Encargados)
  let listaAdmins = admins
    .map(a => `@${a.id.split('@')[0]}`)
    .join('\n');

  // Mensaje final
  let mensaje = `${emoji} 🄻 🄸 🅂 🅃 🄰   🄳 🄴   \n🅁 🄴 🅅 🄸 🅂 🄸 🄾 🄽\n\n` +
                `*Ejemplo*\n❥︎@⁨judai ${emoji}\n🄻✅ 🄼 ✅🄼 ❌🄹 🅅\n~~~~~~~~~~~~~~~~~~~~\n\n` +
                listaRevision +
                `\n~~~~~~~~~~~~~~~~~~~~\n*Encargados*\n${listaAdmins}`;

  await conn.sendMessage(m.chat, {
    text: mensaje,
    mentions: [...members.map(p => p.id), ...admins.map(a => a.id)]
  }, { quoted: m });
};

handler.command = /^revlist8$/i;
handler.tags = ['herramientas'];
handler.help = ['revlist8 <emoji>'];

export default handler;