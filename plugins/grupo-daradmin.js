let handler = async (m, { conn, participants, isAdmin, isBotAdmin, command }) => {
    if (!m.isGroup) return conn.reply(m.chat, '⚠️ Este comando solo funciona en grupos', m);
    if (!isAdmin) return conn.reply(m.chat, '⚠️ Solo admins pueden usar este comando', m);
    if (!isBotAdmin) return conn.reply(m.chat, '⚠️ El bot debe ser admin para esto', m);

    // Obtiene el usuario: mención o respuesta
    let mentioned = m.mentionedJid && m.mentionedJid[0];
    let target = mentioned || m.quoted?.sender;

    if (!target) return conn.reply(m.chat, `❌ Menciona a alguien o responde a su mensaje para ${command}`, m);
    if (target === conn.user.jid) return conn.reply(m.chat, `❌ No puedes ${command} al bot`, m);

    // Verificar que el usuario esté en el grupo
    const participant = participants.find(p => p.id === target);
    if (!participant) return conn.reply(m.chat, '⚠️ Este usuario no está en el grupo', m);

    // Mensajes épicos aleatorios
    const promoteMsgs = [
        `👑🔥 ¡@${target.split('@')[0]} ha ascendido a Dios del grupo! ⚡ Domina este chat con su poder.`,
        `🌟✨ @${target.split('@')[0]} ahora es ADMIN, que todos se inclinen ante su gloria!`,
        `⚡💫 @${target.split('@')[0]} ha recibido los poderes supremos de administración! 🔥`,
        `🔥👑 @${target.split('@')[0]} ha tomado el trono del grupo, ¡que tiemble la chat!`,
        `💎✨ @${target.split('@')[0]} ha sido bendecido con la corona del poder, ¡nuevo ADMIN!`
    ];

    const demoteMsgs = [
        `💀⚡ @${target.split('@')[0]} ha caído de su trono. Sus poderes de ADMIN se han perdido.`,
        `☠️🚫 @${target.split('@')[0]} ha sido degradado, que la humildad lo acompañe.`,
        `😔💔 @${target.split('@')[0]} ya no tiene poderes de ADMIN. Caída épica en el chat.`,
        `🛑⚡ @${target.split('@')[0]} ha perdido su corona y autoridad.`,
        `💥🔥 @${target.split('@')[0]} ha sido expulsado del panteón de los ADMIN.`
    ];

    // Escoger mensaje aleatorio
    const randomPromote = promoteMsgs[Math.floor(Math.random() * promoteMsgs.length)];
    const randomDemote = demoteMsgs[Math.floor(Math.random() * demoteMsgs.length)];

    try {
        if (/^(daradmin|darpoder)$/i.test(command)) {
            await conn.groupParticipantsUpdate(m.chat, [target], 'promote');
            await conn.sendMessage(m.chat, { text: randomPromote, mentions: [target] }, { quoted: m });
        } else if (/^(quitaradmin|quitarpoder)$/i.test(command)) {
            await conn.groupParticipantsUpdate(m.chat, [target], 'demote');
            await conn.sendMessage(m.chat, { text: randomDemote, mentions: [target] }, { quoted: m });
        }
    } catch (e) {
        console.error('Error al actualizar admin:', e);
        conn.reply(m.chat, '❌ No se pudo actualizar el admin, verifica permisos y que el usuario no sea ya admin/bot', m);
    }
};

handler.command = ['daradmin', 'darpoder', 'quitaradmin', 'quitarpoder'];
handler.group = true;
handler.botAdmin = true;
handler.admin = true;
handler.tags = ['group'];
handler.help = ['daradmin @usuario', 'quitaradmin @usuario', 'darpoder @usuario', 'quitarpoder @usuario'];

export default handler;