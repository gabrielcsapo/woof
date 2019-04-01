/* eslint-disable no-console */

const test = require('tape')

const woof = require('../')

test('woof', t => {
  t.test('should be able to take in args argument', t => {
    t.plan(1)

    const cli = woof('', {
      args: ['start', '--unicorn', 'rainbow', '--rainbow', '--amount', '10'],
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
        amount: {
          type: 'integer',
          alias: 'a',
          amount: 1
        },
        unicorn: {
          type: 'string',
          alias: 'u',
          default: 'rainbow'
        }
      }
    })

    t.deepEqual(cli, {
      unicorn: 'rainbow',
      start: true,
      rainbow: true,
      amount: 10
    })
  })

  t.test('should respond with defaults', t => {
    t.plan(1)

    const cli = woof('', {
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
    })

    t.deepEqual(cli, {
      unicorn: 'rainbow'
    })
  })

  t.test('should respond with help menu', t => {
    t.plan(2)

    let logs = []
    const oldLog = process.stdout.write

    process.stdout.write = function () {
      logs.push(Array.prototype.join.call(arguments, ' '))
    }

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
      args: ['--help'],
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
    })
    process.stdout.write = oldLog

    t.deepEqual(logs[0], '\n Usage\n $ foo <input>\n\n Commands:\n   start, -s               Starts foo!\n\n Options\n   --rainbow, -r           Include a rainbow\n   --unicorn, -u [type]    Include a unicorn [rainbow|sea]\n\n Examples\n   $ foo unicorns --rainbow\n   🌈 unicorns 🌈\n\n   $ foo --unicorn rainbow\n   🌈 🦄 🌈\n\n   $ foo --unicorn sea\n   🌊 🦄 🌊\n    \n')
    t.deepEqual(cli, {
      unicorn: 'rainbow',
      help: true
    })
  })

  t.test('should respond with version', t => {
    t.plan(2)

    let logs = []
    const oldLog = process.stdout.write

    process.stdout.write = function () {
      logs.push(Array.prototype.join.call(arguments, ' '))
    }

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
      args: ['--version'],
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
    })
    process.stdout.write = oldLog

    t.deepEqual(logs[0], 'v?\n')
    t.deepEqual(cli, {
      unicorn: 'rainbow',
      version: true
    })
  })

  t.test('should respond with overriden version', t => {
    t.plan(2)

    let logs = []
    const oldLog = process.stdout.write

    process.stdout.write = function () {
      logs.push(Array.prototype.join.call(arguments, ' '))
    }

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
      args: ['--version'],
      version: '1.0.0',
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
    })
    process.stdout.write = oldLog

    t.deepEqual(logs[0], 'v1.0.0\n')
    t.deepEqual(cli, {
      unicorn: 'rainbow',
      version: true
    })
  })

  t.test('should respond with a default validate error', t => {
    t.plan(1)

    const cli = woof('', {
      args: ['--unicorn', 'blue'],
      flags: {
        unicorn: {
          type: 'string',
          alias: 'u',
          default: 'rainbow',
          validate: function (value) {
            return ['rainbow', 'sea'].indexOf(value) > -1
          }
        }
      }
    })

    t.deepEqual(cli, {
      unicorn: 'blue',
      error: 'the value passed into --unicorn is not acceptable: blue'
    })
  })

  t.test('should be able to handle `=` in args', t => {
    t.plan(1)

    const cli = woof('', {
      args: ['start', '--unicorn=blue', '--rainbow', 'amount=10', '-h=150'],
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
        amount: {
          type: 'integer',
          alias: 'a',
          amount: 1
        },
        height: {
          type: 'integer',
          alias: 'h',
          amount: 100
        },
        unicorn: {
          type: 'string',
          alias: 'u',
          default: 'rainbow'
        }
      }
    })

    t.deepEqual(cli, {
      unicorn: 'blue',
      start: true,
      rainbow: true,
      amount: 10,
      height: 150
    })
  })

  t.test('should be able to parse flag defined a list type', t => {
    t.plan(1)

    const cli = woof('', {
      args: ['--paths', '/foo/bar,/bar/foo'],
      flags: {
        paths: {
          type: 'list',
          alias: 'p',
          default: []
        }
      }
    })

    t.deepEqual(cli, { paths: [ '/foo/bar', '/bar/foo' ] })
  })

  t.test('should respond with a custom validate error', t => {
    t.plan(1)

    const cli = woof('', {
      args: ['--unicorn', 'blue'],
      flags: {
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

    t.deepEqual(cli, {
      unicorn: 'blue',
      error: new Error('please providate a valid unicorn type (rainbow|sea), \'blue\' is not a valid option')
    })
  })

  t.test('should select the defaultCommand when no command is passed in', t => {
    t.plan(1)

    const cli = woof('', {
      args: ['--unicorn', 'blue'],
      defaultCommand: 'start',
      commands: {
        start: {
          alias: 's'
        }
      },
      flags: {
        unicorn: {
          type: 'string',
          alias: 'u',
          default: 'rainbow'
        }
      }
    })

    t.deepEqual(cli, {
      unicorn: 'blue',
      start: true
    })
  })
})
