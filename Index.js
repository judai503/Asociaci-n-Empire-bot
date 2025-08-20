import chalk from 'chalk';
import boxen from 'boxen';
import { say } from 'cfonts';

async function showBanner() {
    const title = `
       👑👑👑👑👑👑👑
     👑              👑
   👑   J U D A I     👑
     👑              👑
       👑👑👑👑👑👑👑
    `.split('\n').map(line => chalk.hex('#ff00cc').bold(line)).join('\n');

    const subtitle = chalk.hex('#00eaff').bold('✦ Judai ✦').padStart(40);
    const poweredMsg = chalk.hex('#00eaff').italic('powered by Judai');
    const aiMsg = chalk.hex('#ffb300').bold('🤖 Empire - Tu compañero virtual');
    const tips = [
        chalk.hex('#ffb300')('💡 Tip: Usa .help para ver los comandos disponibles.'),
        chalk.hex('#00eaff')('🌐 Síguenos en GitHub para actualizaciones.'),
        chalk.hex('#ff00cc')('✨ Disfruta de la experiencia premium de Judai.')
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
                title: 'Judai',
                titleAlignment: 'center'
            }
        )
    );

    // Texto animado con cfonts
    say('Judai', {
        font: 'block',
        align: 'center',
        colors: ['blue', 'cyan'],
        background: 'transparent',
        letterSpacing: 1,
        lineHeight: 1
    });
    say('powered by Judai', {
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
