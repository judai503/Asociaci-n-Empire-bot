const handler = async (m, { conn, participants, isBotAdmin, isAdmin, args, command }) => { 
  if (!m.isGroup) return
  if (!isAdmin) return
  if (!isBotAdmin) return

  let user
  if (m.mentionedJid?.length) { 
    user = m.mentionedJid[0] 
  } else if (m.quoted) { 
    user = m.quoted.sender 
  } else if (args[0]) { 
    user = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' 
  } else { 
    return 
  }

  const isParticipant = participants.some(p => p.id === user) 
  if (!isParticipant) return

  // Foto de perfil
  const pp = await conn.profilePictureUrl(user, 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg')

  // Mensajes dinámicos y bonitos
  const mensajes = {
    promote: `
╔════════════════✨
║ 👑 *ADMIN PROMOVIDO* 👑
╠════════════════
║ Nombre: *@${user.split('@')[0]}*
║ Acción: Promovido a ADMIN
║ 💫 ¡Ahora tiene poderes de administración!
╚════════════════
`, 
    demote: `
╔════════════════✨
║ ❌ *ADMIN REMOVIDO* ❌
╠════════════════
║ Nombre: *@${user.split('@')[0]}*
║ Acción: Ya no es ADMIN
║ ⚠️ Sus privilegios han sido revocados
╚════════════════
`
  }

  try { 
    if (/^(daradmin|darpoder)$/i.test(command)) {
      await conn.groupParticipantsUpdate(m.chat, [user], 'promote') 
      await conn.sendMessage(m.chat, { 
        image: { url: pp }, 
        caption: mensajes.promote,
        mentions: [user]
      })
    } else if (/^(quitaradmin|quitarpoder)$/i.test(command)) {
      await conn.groupParticipantsUpdate(m.chat, [user], 'demote') 
      await conn.sendMessage(m.chat, { 
        image: { url: pp }, 
        caption: mensajes.demote,
        mentions: [user]
      })
    }
  } catch (e) { 
    console.error('Error al actualizar admin:', e)
  } 
}

handler.command = [
  'daradmin', 'darpoder', 
  'quitaradmin', 'quitarpoder'
]

handler.group = true
handler.botAdmin = true
handler.admin = true
handler.tags = ['group']
handler.help = [
  'daradmin @usuario', 
  'quitaradmin @usuario', 
  'darpoder @usuario', 
  'quitarpoder @usuario'
]

export default handler