process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'

import './config.js'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import fs, { existsSync } from 'fs'
import yargs from 'yargs'
import chalk from 'chalk'
import boxen from 'boxen'
import { Low, JSONFile } from 'lowdb'
import lodash from 'lodash'
import NodeCache from 'node-cache'
import readline from 'readline'
import pino from 'pino'
import { chain } from 'lodash'

import { makeWASocket, Browsers, useMultiFileAuthState, fetchLatestBaileysVersion, jidNormalizedUser, makeCacheableSignalKeyStore, MessageRetryMap } from '@whiskeysockets/baileys'

// ─── UTILIDADES ──────────────────────────────────────
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

// ─── BANNER DE INICIO ────────────────────────────────
async function showBanner() {
    const title = `
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░
... (resto del banner)
`.split('\n').map(line => chalk.hex('#ff00cc').bold(line)).join('\n')

    console.clear()
    console.log(boxen(title, { 
        padding: 1, 
        margin: 1, 
        borderStyle: 'double', 
        borderColor: 'whiteBright', 
        backgroundColor: 'black', 
        title: 'Empire Bot', 
        titleAlignment: 'center' 
    }))

    cfonts.say('EmpireBot', { font: 'block', align: 'center', colors: ['blue','cyan'], background: 'transparent' })
    console.log(chalk.hex('#ffb300').bold('🤖 Empire Bot - el tío judai'))

    // Animación de carga
    const frames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏']
    for(let i=0;i<20;i++){
        process.stdout.write('\r'+chalk.magentaBright(`Cargando módulos... ${frames[i % frames.length]}`))
        await sleep(70)
    }
    process.stdout.write('\r'+' '.repeat(40)+'\r')
}
await showBanner()

// ─── FUNCIONES GLOBALES ──────────────────────────────
global.__filename = (pathURL = import.meta.url) => fileURLToPath(pathURL)
global.__dirname = (pathURL = import.meta.url) => fileURLToPath(pathURL).replace(/\/[^\/]*$/, '')

// ─── BASE DE DATOS ─────────────────────────────────────
global.db = new Low(new JSONFile('./database.json'))
await global.db.read()
global.db.data ||= { users:{}, chats:{}, stats:{}, msgs:{}, sticker:{}, settings:{} }
global.db.chain = chain(global.db.data)

// ─── OPCIONES DE CONSOLA ─────────────────────────────
global.opts = yargs(process.argv.slice(2)).exitProcess(false).parse()
global.prefix = new RegExp('^[#/!.]')

// ─── SESIÓN MULTI-DISPOSITIVO ────────────────────────
const sessionsDir = './sessions'
const { state, saveCreds } = await useMultiFileAuthState(sessionsDir)
const msgRetryCache = new NodeCache()
const { version } = await fetchLatestBaileysVersion()

// ─── ELECCIÓN MÉTODO DE CONEXIÓN ──────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (text) => new Promise(resolve => rl.question(text, resolve))

let connectionOption
if (!fs.existsSync(`${sessionsDir}/creds.json`)) {
    connectionOption = await ask('1) Escanear QR\n2) Código de emparejamiento\nElige (1 o 2): ')
    if(!/^[1-2]$/.test(connectionOption)) connectionOption = '1'
}

// ─── CONEXIÓN CON WHATSAPP ───────────────────────────
const conn = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: connectionOption === '1',
    browser: Browsers.macOS('Desktop'),
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    autoTyping: true,
    readGroup: true,
    readPrivate: true,
    syncFullHistory: false,
    downloadHistory: false,
    getMessage: async key => {
        const jid = jidNormalizedUser(key.remoteJid)
        return (await global.store?.loadMessage(jid, key.id))?.message || undefined
    },
    msgRetryCounterCache: msgRetryCache,
    msgRetryCounterMap: MessageRetryMap,
    version
})

global.conn = conn
conn.ev.on('creds.update', saveCreds)

// ─── UTILIDADES / API ────────────────────────────────
global.API = (name, path = '/', query = {}, apikeyqueryname) =>
    (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name]} : {})}) : '')
