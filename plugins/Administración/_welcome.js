//▪CÓDIGO BY DEVBRAYAN PRROS XD▪
//▪ROXY BOT MD▪

export async function before(m, { conn }) {
  if (!m.isGroup || !m.messageStubType || !m.messageStubParameters) return;

  // Verifica si la bienvenida está activada y si existe la data del chat
  if (!global.db.data.chats[m.chat] || !global.db.data.chats[m.chat].welcome) return;

  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupDesc = groupMetadata.desc || 'Sin descripción disponible.';
  const participants = m.messageStubParameters || [];

  for (const user of participants) {
    let name = await conn.getName(user);
    let pp = await conn.profilePictureUrl(user, 'image').catch(() =>
      'https://files.cloudkuimages.guru/images/Y7PT6XwM.jpg'
    );
    const taguser = '@' + user.split('@')[0];

    // 📥 BIENVENIDA
    if (m.messageStubType === 27 || m.messageStubType === 31) {
      await conn.sendMessage(m.chat, {
        text: `👋 ¡Bienvenido ${taguser} al grupo *${groupMetadata.subject}*!\n\n📜 Descripción del grupo:\n${groupDesc}`,
        mentions: [user],
        contextInfo: {
          externalAdReply: {
            title: `Nuevo miembro del grupo`,
            body: `${name} se ha unido 🥳`,
            thumbnailUrl: pp,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: pp
          }
        }
      });
    }

    // 📤 DESPEDIDA (si no está desactivada)
    if ((m.messageStubType === 28 || m.messageStubType === 32) && global.db.data.chats[m.chat].despedidas !== false) {
      await conn.sendMessage(m.chat, {
        text: `👋 ${taguser} ha salido del grupo *${groupMetadata.subject}*.`,
        mentions: [user],
        contextInfo: {
          externalAdReply: {
            title: `Miembro salió del grupo`,
            body: `${name} se fue ❌`,
            thumbnailUrl: pp,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: pp
          }
        }
      });
    }
  }
}