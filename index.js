process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'

import './config.js'
import { watchFile, unwatchFile, existsSync } from 'fs'
import cfonts from 'cfonts'
import { fileURLToPath } from 'url'
import fs from 'fs'
import yargs from 'yargs'
import chalk from 'chalk'
import boxen from 'boxen'
import { Low, JSONFile } from 'lowdb'
import { chain } from 'lodash'
import NodeCache from 'node-cache'
import readline from 'readline'
import pino from 'pino'

import {
    makeWASocket,
    Browsers,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    MessageRetryMap,
    makeInMemoryStore
} from '@whiskeysockets/baileys'

// ─── FUNCIONES AUX ───────────────────────────────
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

// ─── BANNER ─────────────────────────────────────
async function showBanner() {
    const title = `
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░
... (resto del banner)
`.split('\n').map(line => chalk.hex('#ff00cc').bold(line)).join('\n')

    console.clear()
    console.log(boxen(title, { padding: 1, margin: 1, borderStyle: 'double', borderColor: 'whiteBright', backgroundColor: 'black', title: 'Empire Bot', titleAlignment: 'center' }))

    cfonts.say('EmpireBot', { font: 'block', align: 'center', colors: ['blue','cyan'], background: 'transparent' })
    console.log(chalk.hex('#ffb300').bold('🤖 Tío Judai - Tu compañero virtual'))

    const frames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏']
    for(let i=0;i<20;i++){
        process.stdout.write('\r'+chalk.magentaBright(`Cargando módulos... ${frames[i % frames.length]}`))
        await sleep(70)
    }
    process.stdout.write('\r'+' '.repeat(40)+'\r')
}
await showBanner()

// ─── GLOBALS ───────────────────────────────────
global.__filename = (pathURL = import.meta.url) => fileURLToPath(pathURL)
global.__dirname = (pathURL = import.meta.url) => fileURLToPath(pathURL).replace(/\/[^\/]*$/, '')

// ─── BASE DE DATOS ─────────────────────────────
global.db = new Low(new JSONFile('./database.json'))
await global.db.read()
global.db.data ||= { users:{}, chats:{}, stats:{}, msgs:{}, sticker:{}, settings:{} }
global.db.chain = chain(global.db.data)

// ─── OPCIONES CONSOLA ──────────────────────────
global.opts = yargs(process.argv.slice(2)).exitProcess(false).parse()
global.prefix = new RegExp('^[#/!.]')

// ─── STORE DE MENSAJES ─────────────────────────
global.store = makeInMemoryStore({ logger: pino({ level: 'silent' }) })
const STORE_FILE = './store.json'
if (existsSync(STORE_FILE)) global.store.readFromFile(STORE_FILE)
setInterval(() => global.store.writeToFile(STORE_FILE), 10_000)

// ─── SESIÓN MULTI-DISPOSITIVO ──────────────────
const sessions = './sessions'
const { state, saveCreds } = await useMultiFileAuthState(sessions)
const msgRetryCounterCache = new NodeCache()
const { version } = await fetchLatestBaileysVersion()

// ─── ELECCIÓN MÉTODO CONEXIÓN ──────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise(resolve => rl.question(text, resolve))

let opcion
if (!existsSync(`${sessions}/creds.json`)) {
    opcion = await question('1) Escanear QR\n2) Código de emparejamiento\nElige (1 o 2): ')
    if(!/^[1-2]$/.test(opcion)) opcion = '1'
}

// ─── CONEXIÓN WA ──────────────────────────────
const conn = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: opcion === '1',
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
    msgRetryCounterCache,
    msgRetryCounterMap: MessageRetryMap,
    version
})

global.conn = conn
conn.ev.on('creds.update', saveCreds)

// ─── UTILIDADES API ───────────────────────────
global.API = (name, path = '/', query = {}, apikeyqueryname) =>
    (name in global.APIs ? global.APIs[name] : name) + path +
    (query || apikeyqueryname ? '?' + new URLSearchParams({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name]} : {})}) : '')
