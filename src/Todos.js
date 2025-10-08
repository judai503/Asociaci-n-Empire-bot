import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, participants }) => {
  if (!m.quoted && !text)
    return conn.reply(m.chat, "❌ Debes enviar un texto o responder a un mensaje para hacer un tag.", m)

  const users = participants.map(u => conn.decodeJid(u.id)) // todos los participantes
  const q = m.quoted ? m.quoted : m
  const c = m.quoted ? m.quoted : m.msg
  const caption = text || q.text || ""

  try {
    let msgContent
    const mime = (q.msg || q).mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)

    if (isMedia && q.download) {
      const media = await q.download()
      if (!media) throw new Error("No se pudo descargar el archivo")

      if (q.mtype === 'imageMessage') {
        msgContent = { image: media, caption }
      } else if (q.mtype === 'videoMessage') {
        msgContent = { video: media, caption, mimetype: 'video/mp4' }
      } else if (q.mtype === 'audioMessage') {
        msgContent = { audio: media, mimetype: 'audio/mp4', fileName: 'Hidetag.mp3' }
      } else if (q.mtype === 'stickerMessage') {
        msgContent = { sticker: media }
      }
    } else {
      msgContent = { text: caption }
    }

    const msg = conn.cMod(
      m.chat,
      generateWAMessageFromContent(
        m.chat,
        { [c.toJSON ? q.mtype : 'extendedTextMessage']: c.toJSON ? c.toJSON() : msgContent },
        { quoted: null, userJid: conn.user.id }
      ),
      caption,
      conn.user.jid,
      { mentions: users }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  } catch (err) {
    console.error(err)
    await conn.reply(m.chat, "❌ Error al ejecutar el hidetag.", m)
  }
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = ['hidetag', 'notify', 'n', 'noti', 'tag']
handler.group = true
handler.admin = true
handler.register = true

export default handler
