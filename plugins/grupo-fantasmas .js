import { areJidsSameUser } from '@whiskeysockets/baileys'

const delay = ms => new Promise(res => setTimeout(res, ms))
let cancelKick = {} // guardamos por chat

var handler = async (m, { conn, participants, command }) => {

  let member = participants.map(u => u.id)
  let sider = []

  if (command === 'cancelkick') {
    cancelKick[m.chat] = true
    return conn.reply(m.chat, '🛑 Proceso de eliminación cancelado.', m)
  }

  // Detectar fantasmas
  for (let i = 0; i < member.length; i++) {
    let userData = global.db.data.users[member[i]] || {}
    let p = participants[i]
    if ((userData.chat === 0 || !userData.chat) &&
        !p?.isAdmin &&
        !p?.isSuperAdmin &&
        userData.whitelist !== true &&
        !areJidsSameUser(member[i], conn.user.jid)) {
      sider.push(member[i])
    }
  }

  if (command === 'fantasmas') {
    if (sider.length === 0) return conn.reply(m.chat, `🟢 Este grupo es activo, no tiene fantasmas.`, m)
    return m.reply(`🕵️‍♂️ *Revisión de inactivos*\n\n👻 *Lista de fantasmas:*\n${sider.map(v => '@' + v.replace(/@.+/, '')).join('\n')}`, null, { mentions: sider })
  }

  if (command === 'kickfantasmas') {
    if (sider.length === 0) return conn.reply(m.chat, `🟢 Este grupo es activo, no tiene fantasmas.`, m)

    await m.reply(`⚠️ *Eliminación de inactivos*\n⏳ _El bot eliminará a los usuarios cada 10 segundos. Escribe .cancelkick para detener el proceso._`, null, { mentions: sider })

    let chat = global.db.data.chats[m.chat]
    chat.welcome = false
    cancelKick[m.chat] = false

    try {
      for (let user of sider) {
        if (cancelKick[m.chat]) break // detiene ciclo si se canceló
        let p = participants.find(v => areJidsSameUser(v.id, user))
        if (!p?.isAdmin && !p?.isSuperAdmin && !areJidsSameUser(user, conn.user.jid)) {
          try {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
            await conn.sendMessage(m.chat, { text: `✅ Usuario eliminado: @${user.split('@')[0]}` }, { mentions: [user] })
            await delay(10000)
          } catch (e) {
            console.log('❌ Error eliminando:', user, e)
          }
        } else {
          await conn.sendMessage(m.chat, { text: `⚠️ No se puede eliminar admin o el bot: @${user.split('@')[0]}` }, { mentions: [user] })
        }
      }
    } finally {
      chat.welcome = true
      cancelKick[m.chat] = false
    }
  }
}

handler.tags = ['grupo']
handler.command = ['fantasmas', 'kickfantasmas', 'cancelkick']
handler.group = true
handler.botAdmin = true
handler.admin = true
handler.fail = null

export default handler