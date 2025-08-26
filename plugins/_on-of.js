// panel-empire.js
import fetch from 'node-fetch'

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin }) => {
  const chat = global.db.data.chats[m.chat]
  const bot = global.db.data.settings[conn.user.jid] || {}
  const type = command.toLowerCase()

  // --- Lista de comandos que se pueden activar/desactivar ---
  const funcionesChat = {
    welcome: 'Welcome',
    modoadmin: 'SoloAdmin',
    antiLink: 'Antilink',
    antiLink2: 'Antilink2',
    detect: 'Detect',
    detect2: 'Detect2',
    antiBot2: 'Antisub',
    reaction: 'Reaction',
    nsfw: 'NSFW'
  }

  const funcionesBot = {
    jadibotmd: 'JadiBotMD'
  }

  // --- Manejo de ON/OFF ---
  if (Object.keys(funcionesChat).includes(type) || Object.keys(funcionesBot).includes(type)) {
    let isEnable
    if (args[0] === 'on' || args[0] === 'enable') isEnable = true
    else if (args[0] === 'off' || args[0] === 'disable') isEnable = false
    else isEnable = null

    if (isEnable === null) {
      const estado = chat[type] ? '🟢 ON' : '🔴 OFF'
      return conn.reply(m.chat,
`⚙️ *${funcionesChat[type] || funcionesBot[type]}*
Estado actual: ${estado}
📌 Usa *${usedPrefix}${type} on* / *${usedPrefix}${type} off*`, m)
    }

    // Validación de permisos
    if (Object.keys(funcionesChat).includes(type) && m.isGroup && !(isAdmin || isOwner)) throw false
    if (Object.keys(funcionesBot).includes(type) && !isOwner) throw false

    // Aplicar cambios
    if (funcionesChat[type]) chat[type] = isEnable
    if (funcionesBot[type]) bot[type] = isEnable

    return conn.reply(m.chat,
`✅ *${funcionesChat[type] || funcionesBot[type]}* ${isEnable ? 'ACTIVADO 🟢' : 'DESACTIVADO 🔴'}`, m)
  }

  // --- Construir panel ---
  const renderEstado = (key, tipo) => {
    if (tipo === 'chat') return chat[key] ? '🟢 ON' : '🔴 OFF'
    if (tipo === 'bot') return bot[key] ? '🟢 ON' : '🔴 OFF'
    return '🔴 OFF'
  }

  let text = '╭─────────────✨ *PANEL EMPIRE BOT* ✨─────────────╮\n\n'

  text += '👑 *GRUPO / ADMIN*\n'
  Object.entries(funcionesChat).slice(0,7).forEach(([key, name]) => {
    text += `⚪ ${name.padEnd(20,'.')} ${renderEstado(key,'chat')}\n`
  })

  text += '\n🎭 *REACCIONES / CONTENIDO*\n'
  Object.entries(funcionesChat).slice(7).forEach(([key, name]) => {
    text += `🟣 ${name.padEnd(20,'.')} ${renderEstado(key,'chat')}\n`
  })

  text += '\n🤖 *GLOBAL / BOT*\n'
  Object.entries(funcionesBot).forEach(([key,name]) => {
    text += `🔵 ${name.padEnd(20,'.')} ${renderEstado(key,'bot')}\n`
  })

  text += '\n╰────────────────────────────────────╯\n'
  text += `\n📌 Usa *<comando> on/off* para activar o desactivar funciones`
  text += `\n💡 Ej: *${usedPrefix}welcome on*  /  *${usedPrefix}modoadmin off*\n`

  // --- Enviar panel con imagen ---
  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/8uhe2o.jpg' },
    caption: text
  })
}

handler.command = ['panel','config','menuconfig','settings','welcome','modoadmin','antilink','antilink2','detect','detect2','antisub','reaction','nsfw','jadibotmd']
handler.tags = ['settings','group']
handler.group = true
handler.register = true

export default handler
