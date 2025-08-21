const handler = async (m, { conn, participants, groupMetadata, isAdmin }) => {
  if (!m.isGroup) return m.reply('❗ Este comando solo se puede usar en grupos.')
  if (!isAdmin) return m.reply('🛡️ Solo los administradores pueden usar este comando.')

  // Filtrar administradores
  const groupAdmins = participants.filter(p => p.admin)
  const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split('-')[0] + '@s.whatsapp.net'

  // Crear lista bonita de admins
  const listAdmin = groupAdmins.map((v, i) => {
    const esOwner = v.id === owner ? '👑 ' : ''
    return `${esOwner}🗣️ ${i + 1}. @${v.id.split('@')[0]}`
  }).join('\n')

  // Mensaje corto y cerrado
  const texto = `✨ *ADMINISTRADORES DEL GRUPO* ✨\n\nTotal: ${groupAdmins.length}\n\n${listAdmin}`

  // Enviar mensaje con menciones
  await conn.sendMessage(m.chat, { text: texto, mentions: [...groupAdmins.map(v => v.id), owner] })
}

handler.help = ['admins']
handler.tags = ['grupo']
handler.command = ['admins']
handler.group = true
handler.admin = true

export default handler