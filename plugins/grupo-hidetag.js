import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, text, participants }) => {
  if (!m.quoted && !text)
    return conn.reply(m.chat, "❌ Debes enviar un texto o responder a un mensaje para hacer un tag.", m)

  const users = participants.map(u => conn.decodeJid(u.id)) // todos los participantes

  try {
    if (m.quoted) {
      const quoted = m.quoted
      const mime = (quoted.msg || quoted).mimetype || ''
      const isMedia = /image|video|sticker|audio/.test(mime)
      const quotedText = quoted.text || quoted?.msg?.conversation || ""
      const caption = text || quotedText // si pusiste texto, reemplaza

      if (isMedia) {
        const media = await quoted.download?.()
        if (!media) throw new Error("No se pudo descargar el archivo")

        if (quoted.mtype === 'imageMessage') {
          await conn.sendMessage(m.chat, { image: media, caption, mentions: users }, { quoted: null })
        } else if (quoted.mtype === 'videoMessage') {
          await conn.sendMessage(m.chat, { video: media, caption, mentions: users, mimetype: 'video/mp4' }, { quoted: null })
        } else if (quoted.mtype === 'audioMessage') {
          await conn.sendMessage(m.chat, { audio: media, mentions: users, mimetype: 'audio/mp4', fileName: 'Hidetag.mp3' }, { quoted: null })
        } else if (quoted.mtype === 'stickerMessage') {
          await conn.sendMessage(m.chat, { sticker: media, mentions: users }, { quoted: null })
        }
      } else {
        // texto simple con mención, sin interlineado al inicio
        await conn.sendMessage(m.chat, { text: caption, mentions: users }, { quoted: null })
      }
    } else {
      // Si no hay mensaje citado, solo texto + mención
      await conn.sendMessage(m.chat, { text, mentions: users }, { quoted: null })
    }
  } catch (err) {
    console.error(err)
    await conn.reply(m.chat, "❌ Error al ejecutar el hidetag.", m)
  }
}

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['hidetag', 'n', 'notificar', 'notify', 'tag']
handler.group = true
handler.admin = true
handler.register = true

export default handler
