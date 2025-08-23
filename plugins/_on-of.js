import { createHash } from 'crypto'
import fetch from 'node-fetch'

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin }) => {
  let chat = global.db.data.chats[m.chat]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = command.toLowerCase()
  let isAll = false

  let isEnable = chat[type] || false

  // --- Manejo ON/OFF ---
  if (args[0] === 'on' || args[0] === 'enable') {
    isEnable = true
  } else if (args[0] === 'off' || args[0] === 'disable') {
    isEnable = false
  } else {
    const estado = isEnable ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
    return conn.reply(m.chat, 
`╭━━━ ⚙️ *Asociación Empire* ⚙️ ━━━╮
┃ 🧩 Función: *${command}*
┃ 
┃ ✨ Uso:
┃ • *${usedPrefix}${command} on*  → Activar
┃ • *${usedPrefix}${command} off* → Desactivar
┃ 
┃ 🎯 Estado actual: ${estado}
╰━━━━━━━━━━━━━━━━━━━━━━━╯`, m)
  }

  // --- Switch de funciones ---
  switch (type) {
    case 'welcome': case 'bv': case 'bienvenida':
      if (m.isGroup && !(isAdmin || isOwner)) throw false
      chat.welcome = isEnable
      break

    case 'antisubbots': case 'antisub': case 'antisubot': case 'antibot2':
      if (m.isGroup && !(isAdmin || isOwner)) throw false
      chat.antiBot2 = isEnable
      break

    case 'modoadmin': case 'soloadmin':
      if (m.isGroup && !(isAdmin || isOwner)) throw false
      chat.modoadmin = isEnable
      break

    case 'reaction': case 'reaccion': case 'emojis':
      if (m.isGroup && !(isAdmin || isOwner)) throw false
      chat.reaction = isEnable
      break

    case 'nsfw': case 'nsfwhot': case 'nsfwhorny':
      if (m.isGroup && !(isAdmin || isOwner)) throw false
      chat.nsfw = isEnable
      break

    case 'jadibotmd': case 'modejadibot':
      if (!isOwner) throw false
      bot.jadibotmd = isEnable
      isAll = true
      break

    case 'detect': case 'avisos':
      if (m.isGroup && !(isAdmin || isOwner)) throw false
      chat.detect = isEnable
      break

    case 'detect2': case 'eventos':
      if (m.isGroup && !(isAdmin || isOwner)) throw false
      chat.detect2 = isEnable
      break

    case 'antilink':
      if (m.isGroup && !(isAdmin || isOwner)) throw false
      chat.antiLink = isEnable
      break

    case 'antilink2':
      if (m.isGroup && !(isAdmin || isOwner)) throw false
      chat.antiLink2 = isEnable
      break

    default:
      return conn.reply(m.chat, '⚠️ ¡Esa función no está soportada!', m)
  }

  // --- Guardado final ---
  chat[type] = isEnable

  conn.reply(m.chat, 
`╭━━ 🎉 *Configuración Actualizada* 🎉 ━━╮
┃ 🧩 Función: *${type}*
┃ 🎛 Estado: ${isEnable ? '✅ ACTIVADO' : '❌ DESACTIVADO'}
┃ ${isAll ? '⚙️ Aplicado globalmente' : '👥 Aplicado en este grupo'}
╰━━━━━━━━━━━━━━━━━━━━━━━╯
✨ ¡Sigue personalizando tu *Asociación Empire*!`, m)
}

handler.help = [
  'welcome', 'bv', 'bienvenida', 
  'antisubbots', 'antisub', 'antisubot', 'antibot2', 
  'modoadmin', 'soloadmin', 
  'reaction', 'reaccion', 'emojis', 
  'nsfw', 'nsfwhot', 'nsfwhorny', 
  'jadibotmd', 'modejadibot', 
  'detect', 'avisos', 
  'detect2', 'eventos', 
  'antilink', 'antilink2'
]
handler.tags = ['group', 'settings']
handler.command = handler.help
handler.register = true

export default handler