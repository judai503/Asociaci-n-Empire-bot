let handler = async (m, { conn }) => {
  let text = m.text.slice(6).trim()
  if (!text) return

  let participants = (await conn.groupMetadata(m.chat)).participants.map(p => p.id)

  conn.sendMessage(m.chat, {
    text,
    mentions: participants
  }, { quoted: m })
}

handler.customPrefix = /^aviso\s+/i
handler.command = new RegExp

export default handler