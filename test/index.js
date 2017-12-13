const test = require('tape');

const woof = require('../');

test('woof', (t) => {
  t.test('simple example', (t) => {
    const cli = woof(`
        Usage
          $ foo <input>

        Commands:
          start, -s               Starts foo!

        Options
          --rainbow, -r           Include a rainbow
          --unicorn, -u [type]    Include a unicorn [rainbow|sea]

        Examples
          $ foo unicorns --rainbow
          🌈 unicorns 🌈

          $ foo --unicorn rainbow
          🌈 🦄 🌈

          $ foo --unicorn rainbow
          🌊 🦄 🌊
    `, {
      args: ['start', '--unicorn', 'rainbow', '--rainbow'],
      commands: {
        start: {
          alias: 's'
        }
      },
      flags: {
        rainbow: {
          type: 'boolean',
          alias: 'r'
        },
        unicorn: {
          type: 'string',
          alias: 'u',
          default: 'rainbow'
        }
      }
    });

    t.deepEqual(cli, { unicorn: 'rainbow', start: true, rainbow: true });
    t.end();
  });
});
