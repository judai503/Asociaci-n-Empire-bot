// plugins/tagall.js
let handler = async (m, { conn, participants, text, isAdmin }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo puede usarse en grupos.')
  if (!isAdmin) return m.reply('🛡️ Solo los administradores pueden usar este comando.')

  const chatData = global.db?.data?.chats?.[m.chat] || {}
  const groupEmoji = chatData.customEmoji || null // emoji personalizado si existe

  const metadata = await conn.groupMetadata(m.chat)
  const groupName = metadata.subject || 'Grupo'
  const total = participants.length
  const messageText = text || (m.quoted?.text ? m.quoted.text : 'Despierten 😴')

  // Lista de emojis variados
  const randomEmojis = [
    '🐒','🦁','🐯','🐸','🐼','🐧','🐤','🦉',
    '🍎','🍉','🍓','🍒','🍍','🥭','🍌','🍇',
    '🦖','🦕','🐲','🦄','🐢','🦊','🐺','🐮',
    '⚡','🔥','💫','🌟','🌙','☀️','⭐','🌈'
  ]

  let textToSend = `✨ *${groupName}*\n\n`
  textToSend += `💬 *Mensaje:* ${messageText}\n`
  textToSend += `👥 *Integrantes:* ${total}\n\n`
  textToSend += `┌───⭓ *Etiquetando a todos...*\n`

  for (const user of participants) {
    const number = user.id.split('@')[0]
    const emoji = groupEmoji || randomEmojis[Math.floor(Math.random() * randomEmojis.length)]
    textToSend += `${emoji} @${number}\n`
  }

  textToSend += `└─────────────⭓\n\n`
  textToSend += `⚡ _empire bot_ ⚡`

  await conn.sendMessage(m.chat, {
    text: textToSend,
    mentions: participants.map(u => u.id)
  }, { quoted: m })
}

handler.help = ['tagall', 'todos', 'invocar']
handler.tags = ['grupo']
handler.command = ['tagall', 'todos', 'invocar']
handler.group = true
handler.admin = true

export default handler
