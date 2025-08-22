let handler = m => m

handler.before = async function (m, { conn }) {
  try {
    if (!m.isGroup || !m.sender) return

    const chatData = global.db.data.chats[m.chat] || {}
    if (!chatData.lastNotify) chatData.lastNotify = {}

    const usuario = `@${m.sender.split('@')[0]}`
    const fkontak = {
      key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" },
      message: { contactMessage: { vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } },
      participant: "0@s.whatsapp.net"
    }

    const now = Date.now()
    if (chatData.lastNotify[m.messageStubType] && now - chatData.lastNotify[m.messageStubType] < 5000) return
    chatData.lastNotify[m.messageStubType] = now

    // Detectar cambios
    const params = m.messageStubParameters || []
    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg'

    // Mensajes dinámicos
    if (m.messageStubType === 22) { // cambio de foto
      await conn.sendMessage(m.chat, { 
        image: { url: pp },
        caption: `✨ *${usuario}* ha actualizado la foto del grupo!\n\n🔹 Observa el nuevo perfil 👀`
      }, { quoted: fkontak })
    }

    if (m.messageStubType === 24) { // cambio de descripción
      const desc = params[0] || 'Sin descripción disponible.'
      await conn.sendMessage(m.chat, { 
        text: `📝 *${usuario}* ha cambiado la descripción del grupo!\n\n🔹 Nueva descripción:\n> ${desc}`
      }, { quoted: fkontak })
    }

    if (m.messageStubType === 16) { // llamada
      await conn.sendMessage(m.chat, { 
        text: `🚫 *${usuario}*, las llamadas están prohibidas!`, 
        mentions: [m.sender] 
      }, { quoted: fkontak })

      // expulsar al que llama
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    }

  } catch (err) {
    console.error('Error en handler dinámico y pesado:', err)
  }
}

export default handler