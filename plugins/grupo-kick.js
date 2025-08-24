const kickHandler = async (m, { conn, text, command }) => {
    const chatId = m.chat;

    if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {};

    // COMANDOS DE CONFIGURACIÓN
    if (command === 'setkick') {
        if (!text) return m.reply(`⚠️ Envía el mensaje que quieras configurar para kick.\nEjemplo: .setkick Adiós, {name}!`);
        global.db.data.chats[chatId].kickMessage = text;
        return m.reply(`✅ Mensaje de kick configurado correctamente para este grupo.`);
    }

    if (command === 'delkick') {
        if (!global.db.data.chats[chatId].kickMessage) return m.reply(`⚠️ No hay mensaje de kick configurado en este grupo.`);
        delete global.db.data.chats[chatId].kickMessage;
        return m.reply(`✅ Mensaje de kick eliminado. Se usará el mensaje por defecto.`);
    }

    // COMANDO DE EXPULSIÓN
    if (command === 'kick') {
        if (!m.mentionedJid?.[0] && !m.quoted) {
            return conn.reply(chatId, `🌸 Debes mencionar a alguien para expulsar.`, m);
        }

        const user = m.mentionedJid?.[0] || m.quoted.sender;
        const groupInfo = await conn.groupMetadata(chatId);
        const ownerGroup = groupInfo.owner || chatId.split('-')[0] + '@s.whatsapp.net';
        const ownerBot = global.owner[0][0] + '@s.whatsapp.net';
        if ([conn.user.jid, ownerGroup, ownerBot].includes(user)) return;

        const name = await conn.getName(user);
        const taguser = '@' + user.split('@')[0];
        const pp = await conn.profilePictureUrl(user, 'image').catch(() =>
            'https://files.cloudkuimages.guru/images/Y7PT6XwM.jpg'
        );

        // Expulsión
        await conn.groupParticipantsUpdate(chatId, [user], 'remove');

        // Mensaje personalizado
        const customKick = global.db.data.chats[chatId]?.kickMessage;
        if (customKick) {
            let finalMessage = customKick
                .replace(/{name}/g, taguser)
                .replace(/{mention}/g, taguser);

            // 🚨 Si no contiene {name} ni {mention}, agregamos la etiqueta al final
            if (!customKick.includes('{name}') && !customKick.includes('{mention}')) {
                finalMessage += ` ${taguser}`;
            }

            // ⚡ Marcar la expulsión para que el welcome/despedida no mande nada
            if (!global.db.data.chats[chatId].kickHandled) global.db.data.chats[chatId].kickHandled = {};
            global.db.data.chats[chatId].kickHandled[user] = true;

            await conn.sendMessage(chatId, {
                text: finalMessage,
                mentions: [user],
                contextInfo: {
                    externalAdReply: {
                        title: `Expulsión`,
                        body: `${name} fue eliminado 🛡️`,
                        thumbnailUrl: pp,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        sourceUrl: pp
                    }
                }
            });
        }
    }
};

kickHandler.help = ['kick','setkick','delkick'];
kickHandler.tags = ['group'];
kickHandler.command = ['kick','echar','hechar','sacar','ban','setkick','delkick'];
kickHandler.admin = true;
kickHandler.group = true;
kickHandler.botAdmin = true;

export default kickHandler;