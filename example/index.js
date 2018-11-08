const woof = require('../')

const cli = woof(`
  Usage
    $ foo <input>

  Commands:
    start, -s               Starts foo!
    compile, -c             Compile foo!

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
    },
    compile: {
      alias: 'c'
    }
  },
  defaultCommand: 'start',
  flags: {
    rainbow: {
      type: 'boolean',
      alias: 'r'
    },
    unicorn: {
      type: 'string',
      alias: 'u',
      default: 'rainbow',
      validate: function (value) {
        return ['rainbow', 'sea'].indexOf(value) === -1 ? `please providate a valid unicorn type (rainbow|sea), '${value}' is not a valid option` : true
      }
    }
  }
})

if (cli.error) {
  console.log(cli.error.message)
} else {
  console.log(cli)
}
