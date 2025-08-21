// index.js
import './banner.js'
import fs from 'fs'

// Archivos candidatos
const candidates = ['main.js', 'bot.js', 'index2.js']

// Buscar cuál existe
const mainFile = candidates.find(file => fs.existsSync(file))

if (!mainFile) {
  console.error('❌ No se encontró ningún archivo principal (main.js, bot.js o index2.js)')
  process.exit(1)
}

// Cargar dinámicamente el bot
import(`./${mainFile}`)
  .then(() => {
    console.log(`✅ Bot cargado con éxito desde ${mainFile}`)
  })
  .catch(err => {
    console.error('❌ Error al iniciar el bot:', err)
  })
