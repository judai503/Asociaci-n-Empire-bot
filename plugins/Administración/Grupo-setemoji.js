/* 
- Setemoji By Angel-OFC 
- Edita el tagall con tu emoji favorito por grupo
*/
let handler = async (m, { conn, text }) => {

  if (!text) {
    return m.reply(`⚠️ Debes proporcionar un emoji válido después del comando. Ejemplo: .setemoji 😎`);
  }

  const emoji = text.trim();

  if (!isEmoji(emoji)) {
    return m.reply(`⚠️ El texto proporcionado no es un emoji válido. Asegúrate de que sea un emoji real.`);
  }

  try {
    // Asegurarse que exista el objeto del chat
    if (!global.db.data.chats[m.chat]) {
      global.db.data.chats[m.chat] = {};
    }

    // Guardar el emoji SOLO para este grupo
    global.db.data.chats[m.chat].customEmoji = emoji;

    m.reply(`✅ El emoji del grupo ha sido actualizado correctamente a: ${emoji}`);
  } catch (error) {
    console.error(error);
    m.reply(`⚠️ Hubo un error al intentar cambiar el emoji.`);
  }
};

const isEmoji = (text) => {
  const emojiRegex =
    /(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{Emoji})/gu;
  return emojiRegex.test(text);
};

handler.help = ['setemoji *<emoji>*'];
handler.tags = ['group'];
handler.command = ['setemoji', 'emotag'];
handler.admin = true;
handler.group = true;

export default handler;