// index.js
import './banner.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Archivos candidatos con extensión
const candidates = ['main.js', 'bot.js', 'index2.js']

// Buscar cuál existe
const mainFile = candidates.find(file => fs.existsSync(path.join(__dirname, file)))

if (!mainFile) {
  console.error('❌ No se encontró ningún archivo principal (main.js, bot.js o index2.js)')
  process.exit(1)
}

// Cargar dinámicamente el bot
const mainPath = path.join(__dirname, mainFile)
import(`file://${mainPath}`)
  .then(() => {
    console.log(`✅ Bot cargado con éxito desde ${mainFile}`)
  })
  .catch(err => {
    console.error('❌ Error al iniciar el bot:', err)
  })
