/* eslint-disable no-console */

const test = require('tape');

const woof = require('../');

test('woof', (t) => {
  t.plan(8);

  t.test('should be able to take in args argument', (t) => {
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
    });

    t.deepEqual(cli, { unicorn: 'rainbow', start: true, rainbow: true, amount: 10 });
    t.end();
  });

  t.test('should respond with defaults', (t) => {
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
    });

    t.deepEqual(cli, { unicorn: 'rainbow' });
    t.end();
  });

  t.test('should respond with help menu', (t) => {
    let logs = [];
    const oldLog = process.stdout.write;

    process.stdout.write = function() {
      logs.push(Array.prototype.join.call(arguments, ' '));
    };

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
    `,
    {
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
    });
    process.stdout.write = oldLog;

    t.deepEqual(logs[0], '\n Usage\n $ foo <input>\n\n Commands:\n   start, -s               Starts foo!\n\n Options\n   --rainbow, -r           Include a rainbow\n   --unicorn, -u [type]    Include a unicorn [rainbow|sea]\n\n Examples\n   $ foo unicorns --rainbow\n   🌈 unicorns 🌈\n\n   $ foo --unicorn rainbow\n   🌈 🦄 🌈\n\n   $ foo --unicorn sea\n   🌊 🦄 🌊\n    \n');
    t.deepEqual(cli, { unicorn: 'rainbow', help: true });
    t.end();
  });

  t.test('should respond with version', (t) => {
    let logs = [];
    const oldLog = process.stdout.write;

    process.stdout.write = function() {
      logs.push(Array.prototype.join.call(arguments, ' '));
    };

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
    `,
    {
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
    });
    process.stdout.write = oldLog;

    t.deepEqual(logs[0], 'v?\n');
    t.deepEqual(cli, { unicorn: 'rainbow', version: true });
    t.end();
  });

  t.test('should respond with overriden version', (t) => {
    let logs = [];
    const oldLog = process.stdout.write;

    process.stdout.write = function() {
      logs.push(Array.prototype.join.call(arguments, ' '));
    };

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
    `,
    {
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
    });
    process.stdout.write = oldLog;

    t.deepEqual(logs[0], 'v1.0.0\n');
    t.deepEqual(cli, { unicorn: 'rainbow', version: true });
    t.end();
  });

  t.test('should respond with a default validate error', (t) => {
    const cli = woof('',
    {
      args: ['--unicorn', 'blue'],
      flags: {
        unicorn: {
          type: 'string',
          alias: 'u',
          default: 'rainbow',
          validate: function(value) {
            return ['rainbow', 'sea'].indexOf(value) > -1;
          }
        }
      }
    });

    t.deepEqual(cli, { unicorn: 'blue', error: 'the value passed into --unicorn is not acceptable: blue' });
    t.end();
  });

  t.test('should be able to handle `=` in args', (t) => {
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
    });

    t.deepEqual(cli, { unicorn: 'blue', start: true, rainbow: true, amount: 10, height: 150 });
    t.end();
  });

  t.test('should respond with a custom validate error', (t) => {
    const cli = woof('',
    {
      args: ['--unicorn', 'blue'],
      flags: {
        unicorn: {
          type: 'string',
          alias: 'u',
          default: 'rainbow',
          validate: function(value) {
            return ['rainbow', 'sea'].indexOf(value) === -1 ? `please providate a valid unicorn type (rainbow|sea), '${value}' is not a valid option` : true;
          }
        }
      }
    });

    t.deepEqual(cli, { unicorn: 'blue', error: new Error('please providate a valid unicorn type (rainbow|sea), \'blue\' is not a valid option') });
    t.end();
  });
});
