// index.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Intentar cargar banner.js sin crashear
try {
  await import(`file://${path.join(__dirname, 'banner.js')}`)
  console.log(chalk.blue('✨ Banner cargado correctamente'))
} catch (err) {
  console.warn(chalk.yellow('⚠️ No se pudo cargar banner.js:'), err.message)
}

// Archivos candidatos para el bot
const candidates = ['main.js', 'bot.js', 'index2.js']

// Buscar cuál existe
const mainFile = candidates.find(file => fs.existsSync(path.join(__dirname, file)))

if (!mainFile) {
  console.error(chalk.red('❌ No se encontró ningún archivo principal (main.js, bot.js o index2.js)'))
  process.exit(1)
}

// Cargar dinámicamente el bot
import(`file://${path.join(__dirname, mainFile)}`)
  .then(() => {
    console.log(chalk.green(`✅ Bot cargado con éxito desde ${mainFile}`))
  })
  .catch(err => {
    console.error(chalk.red('❌ Error al iniciar el bot:'), err)
  })
