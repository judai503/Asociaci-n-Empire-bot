import fetch from "node-fetch";
import yts from "yt-search";

const youtubeRegexID = /(?:youtu.be\/|youtube.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, "❀ Por favor, ingresa el nombre de la música con la palabra 'letra'.\nEjemplo: letra Shape of You", m);
    }

    if (!text.toLowerCase().includes("letra")) {
      return conn.reply(m.chat, "❌ Para descargar solo audio, incluye la palabra 'letra' en tu búsqueda.", m);
    }

    // 🎛️ Reacción al mensaje  
    await conn.sendMessage(m.chat, {  
      react: {  
        text: '🎵',  
        key: m.key,  
      },  
    });

    // Buscar video en YouTube (por URL o texto)
    let videoIdToFind = text.match(youtubeRegexID) || null;
    let searchResult = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1]);

    if (videoIdToFind) {  
      const videoId = videoIdToFind[1];  
      searchResult = searchResult.all.find(item => item.videoId === videoId) || searchResult.videos.find(item => item.videoId === videoId);
    }

    let video = searchResult.all?.[0] || searchResult.videos?.[0] || searchResult;

    if (!video || video.length == 0) {
      return m.reply('✧ No se encontraron resultados para tu búsqueda.');
    }

    // Ignorar videos mayores a 10 minutos
    const durationSeconds = video.seconds || 0;
    if (durationSeconds > 600) return m.reply("⚠ Solo se permiten canciones menores a 10 minutos.");

    // Datos del video
    let { title, thumbnail, timestamp, views, ago, url, author } = video;
    const vistas = formatViews(views);
    const canal = author?.name || 'Desconocido';

    // Miniatura para WhatsApp
    const thumb = (await conn.getFile(thumbnail))?.data;

    // Enviar info previa
    const infoMessage = `「✦」Descargando *${title}*\n\n> ✧ Canal » *${canal}*\n> ✰ Vistas » *${vistas}*\n> ⴵ Duración » *${timestamp}*\n> ✐ Publicado » *${ago}*\n> 🜸 Link » ${url}`;

    await conn.reply(m.chat, infoMessage, m, {
      contextInfo: {
        externalAdReply: {
          title: "🎵 Reproduciendo",
          body: "Tu música está en camino",
          mediaType: 1,
          renderLargerThumbnail: true,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
        },
      },
    });

    // Descargar audio usando API
    try {
      const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json();
      const result = api.result?.download?.url;
      if (!result) throw new Error('⚠ El enlace de audio no se generó correctamente.');

      await conn.sendMessage(m.chat, {
        audio: { url: result },
        fileName: `${api.result.title || title}.mp3`,
        mimetype: 'audio/mpeg'
      }, { quoted: m });

    } catch (e) {
      return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio. Intenta nuevamente más tarde.', m);
    }

  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error}`, m);
  }
};

handler.command = handler.help = ['music', 'rola'];
handler.tags = ['descargas'];
handler.group = true;

export default handler;

function formatViews(views) {
  if (views === undefined) return "No disponible";
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`;
  return views.toString();
}
