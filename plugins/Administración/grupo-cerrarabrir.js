const handler = async (m, { conn, isAdmin, isBotAdmin, command }) => {
  if (!m.isGroup) return m.reply('❗ Este comando solo se puede usar en grupos.')
  if (!isAdmin) return m.reply('🛡️ Solo los administradores pueden usar este comando.')
  if (!isBotAdmin) return m.reply('🤖 Necesito ser administrador para cambiar la configuración del grupo.')

  const mention = m.sender ? [m.sender] : []

  switch (command) {
    case 'abrir':
    case 'grupoabrir':
      await conn.groupSettingUpdate(m.chat, 'not_announcement')
      return conn.sendMessage(m.chat, {
        text: `
🚪 *𝐄𝐥 𝐠𝐫𝐮𝐩𝐨 𝐡𝐚 𝐬𝐢𝐝𝐨 𝐚𝐛𝐢𝐞𝐫𝐭𝐨* 🔓
👤 Administrador: @${m.sender.split('@')[0]}

✨ Ahora *todos* pueden enviar mensajes 📨
🌟 ¡A disfrutar del chat! 🎉
        `,
        mentions: mention
      })
      
    case 'cerrar':
    case 'grupocerrar':
      await conn.groupSettingUpdate(m.chat, 'announcement')
      return conn.sendMessage(m.chat, {
        text: `
🚪 *𝐄𝐥 𝐠𝐫𝐮𝐩𝐨 𝐡𝐚 𝐬𝐢𝐝𝐨 𝐜𝐞𝐫𝐫𝐚𝐝𝐨* 🔒
👤 Administrador: @${m.sender.split('@')[0]}

⚠️ Solo *administradores* pueden enviar mensajes 🛡️
🌙 Hora de descansar del spam 😎
        `,
        mentions: mention
      })
      
    default:
      return m.reply('⚠️ Comando no reconocido. Usa "abrir" o "cerrar".')
  }
}

handler.help = ['abrir', 'cerrar', 'grupoabrir', 'grupocerrar']
handler.tags = ['grupo']
handler.command = ['abrir', 'cerrar', 'grupoabrir', 'grupocerrar']
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler