import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'

//==========================
// 🌸 PROPIETARIOS Y ROLES
//==========================
global.owner = [
  ['50360438371', 'Propietario', true],
  ['rellenar número', '', false],
  ['rellenar número', '', false],
];

global.mods = ['50360438371', 'rellenar número'];
global.suittag = ['50360438371', 'rellenar número'];
global.prems = ['50360438371'];

//==========================
// 🌸 INFORMACIÓN DEL BOT
//==========================
global.sessions = 'Sessions';
global.jadi = 'JadiBots';
global.multiDevice = true;

//==========================
// 🌸 MARCA DEL BOT
//==========================
global.packname = 'Bot ⚜️ (Multi-Device)';
global.botname = 'Bot ⚜️';
global.wm = 'Bot ⚜️';
global.dev = 'Empire-bot ⚜️';
global.textbot = 'Bot By Empire-bot ⚜️';
global.etiqueta = 'WhatsApp Bot';

//==========================
// 🌸 MONEDA
//==========================
global.moneda = 'dolares';

//==========================
// 🌸 MENÚ Y ESTILO
//==========================
global.v = '-'   
global.eror = "_hubo un error_"
global.lopr = "🅟"
global.lolm = "Ⓛ"
global.dmenut = "✦ ───『"
global.dmenub = "│➭" 
global.dmenub2 = "│乂"
global.dmenuf = "╰━━━━━━━━┈─◂"
global.cmenut = "⫹⫺ ───『"
global.cmenuh = "』─── ⬟"
global.cmenub = "│〆"
global.cmenuf = "╰━━━━━━━━┈─◂"
global.cmenua = "\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n"
global.dashmenu = "✧────···[ *Dashboard* ]···────✧"
global.htki = '––––––『'
global.htka = '』––––––'
global.htjava = "⫹⫺"
global.comienzo = "• • ◕◕════"
global.fin = " • •"

//==========================
// 🌸 IMAGENES
//==========================
global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.photoSity = [catalogo]

//==========================
// 🌸 GRUPOS Y CANALES (VACÍOS O BORRADOS)
//==========================
global.gp1 = ''
global.channel2 = ''
global.md = ''
global.correo = 'rellenar correo'
global.cn = '';

//==========================
// 🌸 ESTILO DE MENSAJE
//==========================
global.estilo = { 
  key: {  
    fromMe: false, 
    participant: `0@s.whatsapp.net`, 
    ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) 
  }, 
  message: { 
    orderMessage: { 
      itemCount : -999999, 
      status: 1, 
      surface : 1, 
      message: packname, 
      orderTitle: 'Bang', 
      thumbnail: catalogo, 
      sellerJid: '0@s.whatsapp.net'
    }
  }
}
global.ch = {
  ch1: '120363312092804854@newsletter',
}

//==========================
// 🌸 APIs Y LLAVES
//==========================
global.MyApiRestBaseUrl = 'https://api.cafirexos.com';
global.MyApiRestApikey = 'BrunoSobrino';
global.openai_org_id = 'org-3';
global.openai_key = 'sk-0';
global.keysZens = ['LuOlangNgentot', 'c2459db922', '37CC845916', '6fb0eff124', 'hdiiofficial', 'fiktod', 'BF39D349845E', '675e34de8a', '0b917b905e6f'];
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())];
global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu', 'cb15ed422c71a2fb', '5bd33b276d41d6b4', 'HIRO', 'kurrxd09', 'ebb6251cc00f9c63'];
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())];
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5'];
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())];
global.lolkeysapi = ['kurumi']; 
global.itsrose = ['4b146102c4d500809da9d1ff'];

//==========================
// 🌸 ACTUALIZACIÓN AUTOMÁTICA
//==========================
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
