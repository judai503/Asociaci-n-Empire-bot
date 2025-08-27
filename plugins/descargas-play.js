import fetch from "node-fetch"
import yts from 'yt-search'

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `✨ ¿Qué canción quieres escuchar?`, m)
    }

    // 🎵 Reacción del bot
    await conn.sendMessage(m.chat, {
      react: { text: '🎶', key: m.key }
    })

    // Siempre agrega "letra" a la búsqueda
    let searchQuery = `${text} letra`
    let results = await yts(searchQuery)

    // Filtrar para que no pase de 10 minutos
    let video = results.videos.find(v => v.seconds <= 600)
    if (!video) {
      return conn.reply(m.chat, 
`╭─❖ 「 ⚠️ No encontrado 」
│ ✧ No hallé canciones de menos de 10 min.
│ ✧ Intenta con otro título más corto 🎵
╰────────────────❖`, m)
    }

    let { title, url } = video

    // Descargar desde la API
    try {
      const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
      const result = api.result?.download?.url    

      if (!result) throw new Error('falló')

      await conn.sendMessage(m.chat, {
        audio: { url: result },
        fileName: `${api.result.title}.mp3`,
        mimetype: 'audio/mpeg'
      }, { quoted: m })

    } catch (e) {
      return conn.reply(m.chat, 
`╭─❖ 「 ⚠️ Error de descarga 」
│ 🎶 Lo siento, no pude enviar el audio.
│ ✧ Puede que el archivo sea muy pesado
│ ✧ O que el enlace haya fallado.
│ 
│ 🔁 Intenta nuevamente con otra canción.
╰────────────────❖`, m)
    }

  } catch (error) {
    return m.reply(`⚠️ Error inesperado:\n${error}`)
  }
}

handler.command = ['play']
handler.tags = ['descargas']
handler.help = ['play <canción>']

export default handler
