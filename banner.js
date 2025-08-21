import chalk from 'chalk';
import boxen from 'boxen';
import { say } from 'cfonts';

async function showBanner() {
  const title = `
     👑👑👑👑👑👑👑
   👑              👑
 👑   E M P I R E   👑
   👑              👑
     👑👑👑👑👑👑👑
  `.split('\n').map(line => chalk.hex('#ffcc00').bold(line)).join('\n');

  const subtitle = chalk.hex('#00eaff').bold('✦ Empire Bot ✦').padStart(40);
  const poweredMsg = chalk.hex('#00eaff').italic('powered by Empire');
  const aiMsg = chalk.hex('#ffb300').bold('🤖 Empire - Tu compañero virtual');
  const tips = [
    chalk.hex('#ffb300')('💡 Tip: Usa /help para ver los comandos disponibles.'),
    chalk.hex('#00eaff')('🌐 Síguenos en GitHub para actualizaciones.'),
    chalk.hex('#ffcc00')('✨ Disfruta de la experiencia premium de Empire.')
  ];

  // Banner principal
  console.clear();
  console.log(
    boxen(
      title + '\n' + subtitle,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'whiteBright',
        backgroundColor: 'black',
        title: 'Empire Bot',
        titleAlignment: 'center'
      }
    )
  );

  // Texto animado con cfonts
  say('Empire Bot ⚜️', {
    font: 'block',
    align: 'center',
    colors: ['yellow', 'cyan'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1
  });
  say('powered by Empire', {
    font: 'console',
    align: 'center',
    colors: ['blue'],
    background: 'transparent'
  });
  console.log('\n' + aiMsg + '\n');

  tips.forEach(tip => console.log(tip));
}

// Llamada principal
showBanner();
