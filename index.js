// index.js
import fs from 'fs';
import chalk from 'chalk';
import boxen from 'boxen';
import { say } from 'cfonts';

// Mostrar banner
function showBanner() {
  const title = `
     👑👑👑👑👑👑👑
   👑              👑
 👑   E M P I R E   👑
   👑              👑
     👑👑👑👑👑👑👑
  `.split('\n').map(line => chalk.hex('#ffcc00').bold(line)).join('\n');

  const subtitle = chalk.hex('#00eaff').bold('✦ Empire Bot ✦').padStart(40);
  const aiMsg = chalk.hex('#ffb300').bold('🤖 Empire - Tu compañero virtual');

  console.clear();
  console.log(boxen(title + '\n' + subtitle, {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'whiteBright',
    backgroundColor: 'black',
    title: 'Empire Bot',
    titleAlignment: 'center'
  }));

  say('Empire Bot ⚜️', {
    font: 'block',
    align: 'center',
    colors: ['yellow', 'cyan'],
    background: 'transparent'
  });
  say('powered by Empire', {
    font: 'console',
    align: 'center',
    colors: ['blue'],
    background: 'transparent'
  });

  console.log('\n' + aiMsg + '\n');
}

// Cargar el bot
function loadBot() {
  const candidates = ['main.js', 'bot.js', 'index2.js'];
  for (let file of candidates) {
    if (fs.existsSync(file)) {
      try {
        import(`./${file}`).then(() => {
          console.log(chalk.green(`✅ Bot cargado desde ${file}`));
        }).catch(err => {
          console.error(chalk.red('❌ Error al cargar el bot:'), err);
        });
      } catch (err) {
        console.error(chalk.red('❌ Error al importar el archivo:'), err);
      }
      return;
    }
  }
  console.error(chalk.red('❌ No se encontró ningún archivo principal (main.js, bot.js, index2.js)'));
  process.exit(1);
}

// Ejecutar
showBanner();
loadBot();
