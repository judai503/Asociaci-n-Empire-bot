import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { text, conn }) => {
  if (!text) return m.reply('🔍 Ingresa el nombre de una canción. Ej: *.play1 Aishite Ado*');

  // Agregar automáticamente "letra" a la búsqueda
  text = text + ' letra';

  // 🎧 Reacción
  await conn.sendMessage(m.chat, {
    react: {
      text: '🎧',
      key: m.key,
    },
  });

  try {
    const search = await yts.search(text);
    const video = search.videos[0]; // primer resultado siempre

    if (!video) return m.reply('⚠️ No se encontraron resultados.');

    if (video.seconds > 600) {
      return m.reply(`
╭─❖ 「 ⚠️ Duración no válida 」
│ ✧ El video *${video.title}*
│ ✧ Dura más de *10 minutos* ⏱️
│ 
│ 🔁 Intenta con otra canción.
╰──────────────────────❖
`.trim());
    }

    const { title, url, timestamp, ago, views, author, thumbnail } = video;

    const msgInfo = `
╭─❖ 「 🎶 Descarga en curso 」
│ 💿 *Nombre:* ${title}
│ ⏱️ *Duración:* ${timestamp}
│ 👀 *Vistas:* ${views.toLocaleString()}
│ 🎤 *Autor:* ${author.name}
│ 📅 *Publicado:* ${ago}
│ 🔗 *Link:* ${url}
╰───────────────────❖
`.trim();

    // Enviar info + thumbnail
    await conn.sendMessage(
      m.chat,
      { image: { url: thumbnail }, caption: msgInfo },
      { quoted: m }
    );

    // Descargar audio
    const apiUrl = `https://orbit-oficial.vercel.app/api/download/YTMP3?key=OrbitPlus&url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status || !data.download) {
      throw new Error('No se pudo obtener el enlace de descarga.');
    }

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: data.download },
        mimetype: 'audio/mpeg',
        fileName: `${data.title}.mp3`,
      },
      { quoted: m }
    );

    // ✅ Reacción final al terminar
    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key,
      },
    });

  } catch (e) {
    console.error(e);
    m.reply(`
╭─❖ 「 ⚠️ Error de descarga 」
│ ✧ Lo siento, no pude enviar el audio.
│ ✧ Puede que el archivo sea muy pesado
│ ✧ O que el enlace haya fallado.
│
│ 🔁 Intenta nuevamente con otra canción.
╰──────────────────────❖
`.trim());
  }
};

handler.command = ['play1'];
handler.help = ['play1 <canción>'];
handler.tags = ['downloader'];

export default handler;