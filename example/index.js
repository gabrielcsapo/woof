const woof = require('../');

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

      $ foo --unicorn sea
      🌊 🦄 🌊
`, {
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

console.log(cli);
