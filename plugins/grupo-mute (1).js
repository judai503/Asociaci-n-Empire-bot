let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Obtiene el usuario: si mencionas @user o respondes a un mensaje
    let mentioned = m.mentionedJid && m.mentionedJid[0];
    let target = mentioned || m.quoted?.sender;

    if (!target) return conn.reply(m.chat, `❌ Menciona a alguien o responde a su mensaje para ${command}`, m);

    if (target === conn.user.jid) return conn.reply(m.chat, `❌ No puedes ${command} al bot`, m);

    // Inicializa datos si no existen
    global.db.data.users[target] = global.db.data.users[target] || {};

    if (command.toLowerCase() === 'mute') {
        global.db.data.users[target].mute = true;
        await conn.sendMessage(m.chat, {
            text: `🔇 @${target.split('@')[0]} ha sido muteado`,
            mentions: [target]
        }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '🤫', key: m.key } });
    } else if (command.toLowerCase() === 'unmute') {
        global.db.data.users[target].mute = false;
        await conn.sendMessage(m.chat, {
            text: `🔊 @${target.split('@')[0]} ya no está muteado`,
            mentions: [target]
        }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '🤫', key: m.key } });
    }
}

handler.help = ['mute', 'unmute'];
handler.tags = ['admin'];
handler.command = /^(mute|unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

module.exports = handler;