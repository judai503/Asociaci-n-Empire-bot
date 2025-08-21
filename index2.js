// index.js
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

// Intentar cargar banner.js si existe
const bannerPath = path.join('.', 'banner.js')
if (fs.existsSync(bannerPath)) {
  try {
    await import(`./banner.js`)
  } catch (e) {
    console.log(chalk.yellow('⚠️  Error al cargar banner.js, se continuará sin él.'))
  }
}

// Archivos candidatos para el bot
const candidates = ['main.js', 'bot.js', 'index2.js']

// Buscar cuál existe
const mainFile = candidates.find(file => fs.existsSync(file))

if (!mainFile) {
  console.error(chalk.red('❌ No se encontró ningún archivo principal (main.js, bot.js o index2.js)'))
  process.exit(1)
}

// Cargar dinámicamente el bot
import(`./${mainFile}`)
  .then(() => {
    console.log(chalk.green(`✅ Bot cargado con éxito desde ${mainFile}`))
  })
  .catch(err => {
    console.error(chalk.red('❌ Error al iniciar el bot:'), err)
    process.exit(1)
  })
