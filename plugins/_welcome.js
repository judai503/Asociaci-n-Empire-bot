// ================== BEFORE HANDLER (welcome + despedida con .setadios) ==================
export async function before(m, { conn }) {
  if (!m.isGroup || !m.messageStubType || !m.messageStubParameters) return;

  const chatData = global.db.data.chats[m.chat] || {};
  const superWelcome = global.db.data.settings?.superWelcome || false;
  if (!chatData.welcome && !superWelcome) return;

  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupDesc = groupMetadata.desc || 'Sin descripción disponible.';
  const participants = m.messageStubParameters || [];

  const despedidasGenericas = [
    "👋 Se fue como un ninja silencioso...",
    "⚠️ Adiós! Nos vemos en la próxima misión!",
    "💔 Al parecer se cansó de nosotros...",
    "😢 Otro que nos deja, suerte!",
    "🏃‍♂️ Salió corriendo del grupo!"
  ];

  for (const user of participants) {
    const name = await conn.getName(user);
    const taguser = '@' + user.split('@')[0];
    const pp = await conn.profilePictureUrl(user, 'image').catch(() =>
      'https://files.cloudkuimages.guru/images/Y7PT6XwM.jpg'
    );

    // BIENVENIDA
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

    // DESPEDIDA (solo si NO fue kickeado)
    if ((m.messageStubType === 28 || m.messageStubType === 32) && chatData.despedidas !== false) {
      if (chatData.kickHandled?.[user]) {
        delete chatData.kickHandled[user];
        continue;
      }

      setTimeout(async () => {
        try {
          const updatedParticipants = (await conn.groupMetadata(m.chat)).participants.map(p => p.id);
          if (!updatedParticipants.includes(user)) {
            // Si hay mensaje personalizado de .setadios
            const customBye = chatData.adiosMessage;
            const finalMessage = customBye
              ? customBye.replace(/{name}/g, taguser).replace(/{mention}/g, taguser)
              : despedidasGenericas[Math.floor(Math.random() * despedidasGenericas.length)] + `\n👋 ${taguser}`;

            await conn.sendMessage(m.chat, {
              text: finalMessage,
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
        } catch (e) {
          console.error('Error enviando despedida:', e);
        }
      }, 1000); // Envia casi inmediato
    }
  }
}