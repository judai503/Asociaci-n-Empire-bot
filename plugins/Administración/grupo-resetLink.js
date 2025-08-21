// ▪CÓDIGO BY DEVBRAYAN PRROS XD▪
// ▪ROXY BOT MD▪

const handler = async (m, { conn }) => {
  try {
    const revoke = await conn.groupRevokeInvite(m.chat)
    const newLink = 'https://chat.whatsapp.com/' + revoke

    await conn.sendMessage(m.chat, {
      text: `✨ *El enlace del grupo se restableció con éxito* ✨\n\n🔗 *Nuevo link:* ${newLink}`,
      contextInfo: {
        externalAdReply: {
          title: '🔄 Link actualizado',
          body: 'Todos pueden unirse nuevamente',
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: 'https://i.imgur.com/XqQZ4mO.jpeg',
          sourceUrl: newLink
        }
      }
    }, { quoted: m })
  } catch (e) {
    await m.reply('❌ Ocurrió un error al restablecer el link.')
    console.error(e)
  }
}

handler.help = ['reset']
handler.tags = ['group']
handler.command = ['r', 'nuevolink', 'resetlink']
handler.botAdmin = true
handler.admin = true
handler.group = true
handler.register = true

export default handler

// 🚫 FILTRO PARA ELIMINAR EL AVISO AUTOMÁTICO DE WHATSAPP
export async function before(m, { conn }) {
  if (!m.isGroup) return
  // 21 = "se restableció el enlace del grupo"
  if (m.messageStubType === 21) {
    try {
      await conn.sendMessage(m.chat, { delete: m.key })
      console.log('🗑️ Aviso automático de link eliminado.')
    } catch (e) {
      console.error('Error eliminando aviso de link:', e)
    }
  }
}