import axios from 'axios'

async function obtenerTokenYCookie() {
  const res = await axios.get('https://tmate.cc/id', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  })
  const cookie = res.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || ''
  const tokenMatch = res.data.match(/<input[^>]+name="token"[^>]+value="([^"]+)"/i)
  const token = tokenMatch?.[1]
  if (!token) throw new Error('No se encontró el token')
  return { token, cookie }
}

async function descargarDeTikTok(urlTikTok) {
  const { token, cookie } = await obtenerTokenYCookie()
  const params = new URLSearchParams()
  params.append('url', urlTikTok)
  params.append('token', token)

  const res = await axios.post('https://tmate.cc/action', params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0',
      'Referer': 'https://tmate.cc/id',
      'Origin': 'https://tmate.cc',
      'Cookie': cookie
    }
  })

  const html = res.data?.data
  if (!html) throw new Error('No se recibió ningún dato')

  const coincidencias = [...html.matchAll(/<a[^>]+href="(https:\/\/[^"]+)"[^>]*>\s*<span>\s*<span>([^<]*)<\/span><\/span><\/a>/gi)]
  const vistos = new Set()
  
  const enlacesMp4 = coincidencias
    .map(([_, href, label]) => ({ href, label: label.trim() }))
    .filter(v => /download without watermark/i.test(v.label) && !vistos.has(v.href) && vistos.add(v.href))

  if (enlacesMp4.length > 0) return enlacesMp4[0].href

  throw new Error('No se encontró un video, verifica el enlace')
}

let tiktokdl = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚠️ Debes enviar un enlace de TikTok.\nEjemplo: *${usedPrefix + command}* https://vt.tiktok.com/abcd/`)

  try {
    const videoUrl = await descargarDeTikTok(text)

    // Reacción de video
    await conn.sendMessage(m.chat, { react: { text: '🎬', key: m.key } })

    // Enviar el video
    await conn.sendMessage(m.chat, { video: { url: videoUrl } })

  } catch (e) {
    await m.reply(`❌ No se pudo descargar el video. Verifica el enlace o intenta nuevamente.\n> ${e.message}`)
  }
}

tiktokdl.command = ['tiktok', 'ttdl', 'tt']
tiktokdl.limit = true
export default tiktokdl
