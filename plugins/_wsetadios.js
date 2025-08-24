// ================== COMANDO .setadios / .deladios ==================
let adiosHandler = async (m, { conn, text, command }) => {
  const chatId = m.chat;
  if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {};

  if (command === 'setadios') {
    if (!text) return m.reply(`⚠️ Envía el mensaje que quieras configurar para despedidas.\nEjemplo: .setadios Adiós, {name}!`);
    global.db.data.chats[chatId].adiosMessage = text;
    return m.reply(`✅ Mensaje de despedida configurado correctamente para este grupo.`);
  }

  if (command === 'deladios') {
    if (!global.db.data.chats[chatId].adiosMessage) return m.reply(`⚠️ No hay mensaje de despedida configurado en este grupo.`);
    delete global.db.data.chats[chatId].adiosMessage;
    return m.reply(`✅ Mensaje de despedida eliminado. Se usarán mensajes genéricos.`);
  }
};

adiosHandler.help = ['setadios','deladios'];
adiosHandler.tags = ['group'];
adiosHandler.command = ['setadios','deladios'];
adiosHandler.admin = true;
adiosHandler.group = true;
export default adiosHandler;

// ================== BEFORE HANDLER (despedida automática con mención) ==================

export async function before(m, { conn }) {

  if (!m.isGroup || !m.messageStubType || !m.messageStubParameters) return;

  const chatData = global.db.data.chats[m.chat] || {};

  const participants = m.messageStubParameters || [];

  for (const user of participants) {

    const name = await conn.getName(user);

    const taguser = '@' + user.split('@')[0];

    const pp = await conn.profilePictureUrl(user, 'image').catch(() =>

      'https://files.cloudkuimages.guru/images/Y7PT6XwM.jpg'

    );

    // Detectar salida automática (no kick manual)

    if ((m.messageStubType === 28 || m.messageStubType === 32)) {

      if (chatData.kickHandled?.[user]) {

        delete chatData.kickHandled[user];

        continue;

      }

      const adiosCustom = chatData.adiosMessage;

      if (adiosCustom) {

        // 🔹 Reemplazar {mention} con el formato que WhatsApp reconoce

        const mentionText = `@${user.split('@')[0]}`;

        const finalMessage = adiosCustom

          .replace(/{name}/g, taguser)

          .replace(/{mention}/g, mentionText);

        await conn.sendMessage(m.chat, {

          text: finalMessage,

          mentions: [user], // <- asegura que WhatsApp haga la mención

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

} 
              