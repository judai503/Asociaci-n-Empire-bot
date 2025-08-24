// ▪CÓDIGO BY DEVBRAYAN ▪
// ▪ROXY BOT MD▪

const handler = async (m, { conn, text, command }) => {
  const chatId = m.chat;

  // ================== RESET LINK ==================
  if (command === 'resetlink' || command === 'r' || command === 'nuevolink') {
    try {
      const revoke = await conn.groupRevokeInvite(chatId);
      const newLink = 'https://chat.whatsapp.com/' + revoke;

      const pp = await conn.profilePictureUrl(chatId, 'image').catch(() => 'https://i.imgur.com/XqQZ4mO.jpeg');

      await conn.sendMessage(chatId, {
        text: `✨ *El enlace del grupo se restableció con éxito* ✨\n\n🔗 *Nuevo link:* ${newLink}`,
        contextInfo: {
          externalAdReply: {
            title: '🔄 Link actualizado',
            body: 'Todos pueden unirse nuevamente',
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnailUrl: pp,
            sourceUrl: newLink
          }
        }
      }, { quoted: m });
    } catch (e) {
      await m.reply('❌ Ocurrió un error al restablecer el link.');
      console.error(e);
    }
    return;
  }

  // ================== SETRULES / RULES ==================
  if (command === 'setrules') {
    if (!text) return m.reply(`⚠️ Envía la descripción o reglas que quieras configurar.\nEjemplo: .setrules No hacer spam, respetar a todos.`);

    try {
      await conn.groupUpdateDescription(chatId, text);
      return m.reply(`✅ Descripción del grupo actualizada correctamente.`);
    } catch (e) {
      console.error(e);
      return m.reply('❌ No pude actualizar la descripción del grupo. Asegúrate que el bot es admin.');
    }
  }

  if (command === 'rules') {
    try {
      const groupMetadata = await conn.groupMetadata(chatId);
      const rulesText = groupMetadata.desc || 'Sin descripción disponible.';
      const pp = await conn.profilePictureUrl(chatId, 'image').catch(() => 'https://i.imgur.com/XqQZ4mO.jpeg');

      await conn.sendMessage(chatId, {
        text: `📜 *Reglas del grupo:*\n${rulesText}`,
        contextInfo: {
          externalAdReply: {
            title: '📋 Reglas del grupo',
            body: 'Lee las reglas antes de participar',
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnailUrl: pp,
            sourceUrl: pp
          }
        }
      }, { quoted: m });
    } catch (e) {
      console.error(e);
      return m.reply('❌ No pude obtener la descripción del grupo.');
    }
  }
};

handler.help = ['resetlink','r','nuevolink','setrules','rules'];
handler.tags = ['group'];
handler.command = ['resetlink','r','nuevolink','setrules','rules'];
handler.botAdmin = true; // necesario para cambiar descripción o link
handler.admin = true;
handler.group = true;
handler.register = true;

export default handler;

// 🚫 FILTRO PARA ELIMINAR EL AVISO AUTOMÁTICO DE WHATSAPP AL RESETEAR LINK
export async function before(m, { conn }) {
  if (!m.isGroup) return;
  // 21 = "se restableció el enlace del grupo"
  if (m.messageStubType === 21) {
    try {
      await conn.sendMessage(m.chat, { delete: m.key });
      console.log('🗑️ Aviso automático de link eliminado.');
    } catch (e) {
      console.error('Error eliminando aviso de link:', e);
    }
  }
}