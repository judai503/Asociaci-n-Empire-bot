import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ✨ Información del bot
global.owner = [
  ['50360438371', 'Empire Bot ⚜️', true],
  ['rellenar número', 'Nombre de Canal 1', false],
  ['rellenar número', 'Nombre de Canal 2', false],
];

global.mods = ['50360438371', 'rellenar número'];
global.suittag = ['50360438371', 'rellenar número'];
global.prems = ['50360438371'];

global.libreria = 'Baileys';
global.nameqr = 'EmpireBot';
global.namebot = 'EmpireBot ⚜️';
global.sessions = 'Sessions';
global.jadi = 'JadiBots';
global.roxyJadibts = true;

global.packname = 'EmpireBot';
global.botname = '👑 EmpireBot ⚜️';
global.wm = '👑 EmpireBot ⚜️';
global.dev = 'Empire Developer';
global.textbot = 'EmpireBot ⚜️';
global.etiqueta = 'EmpireBot WhatsApp Bot';

global.moneda = 'dolares';

global.namabot = 'EmpireBot ⚜️';
global.v = '-';
global.eror = "_Hubo un error_";
global.lopr = "🅟";
global.lolm = "Ⓛ";
global.dmenut = "✦ ───『";
global.dmenub = "│➭";
global.dmenub2 = "│乂";
global.dmenuf = "╰━━━━━━━━┈─◂";
global.cmenut = "⫹⫺ ───『";
global.cmenuh = "』─── ⬟";
global.cmenub = "│〆";
global.cmenuf = "╰━━━━━━━━┈─◂";
global.cmenua = "\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n     ";
global.dashmenu = "✧────···[ *Dashboard* ]···────✧";
global.htki = '––––––『';
global.htka = '』––––––';
global.htjava = "⫹⫺";
global.comienzo = "• • ◕◕════";
global.fin = " • •";

global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.photoSity = [catalogo];

global.gp1 = 'https://chat.whatsapp.com/F8KwM3rVqkS9HhR5msoRqQ';
global.channel2 = 'https://whatsapp.com/channel/0029VajUPbECxoB0cYovo60W';
global.md = 'https://github.com/Empire-Bot/EmpireBot-MD';
global.correo = 'empirebot@gmail.com';
global.cn = 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m';

global.estilo = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
  },
  message: {
    orderMessage: {
      itemCount: -999999,
      status: 1,
      surface: 1,
      message: packname,
      orderTitle: 'EmpireBot',
      thumbnail: catalogo,
      sellerJid: '0@s.whatsapp.net',
    },
  },
};

global.MyApiRestBaseUrl = 'https://api.empirebot.com';
global.MyApiRestApikey = 'EmpireApiKey';
global.openai_org_id = 'org-empire';
global.openai_key = 'sk-empire';
global.keysZens = ['EmpireKey1', 'EmpireKey2'];
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())];
global.keysxteammm = ['EmpireXTeamKey1', 'EmpireXTeamKey2'];
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())];
global.keysneoxrrr = ['EmpireNeoxKey1', 'EmpireNeoxKey2'];
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())];
global.lolkeysapi = ['EmpireLolKey'];
global.itsrose = ['EmpireItsRoseKey'];
