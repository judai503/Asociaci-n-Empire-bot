let handler = async (m, { conn }) => {
  let text = m.text.slice(6).trim() // asumiendo que tu comando empieza con "aviso "
  if (!text) return

  let participants = (await conn.groupMetadata(m.chat)).participants.map(p => p.id)

  // Caracteres invisibles para ocultar menciones y evitar "leer más"
  const invisible = String.fromCharCode(8206).repeat(850)

  await conn.sendMessage(m.chat, {
    text: `${invisible}\n${text}`,
    mentions: participants
  }, { quoted: m })
}

handler.customPrefix = /^aviso\s+/i
handler.command = new RegExp

export default handler
