const test = require('tape');

const {
  dedent,
  flatten
} = require('../util');

test('util', (t) => {
  t.plan(2);

  t.test('@dedent', (t) => {
    t.test('should work on simple es6 template string', (t) => {
      let dedented = dedent(`
        Usage
          $ foo <input>

        Commands:
          start, -s               Starts foo!
      `);
      t.equal(dedented, ' Usage\n   $ foo <input>\n\n Commands:\n   start, -s               Starts foo!\n      ');
      t.end();
    });

    t.test('should work on mixed tabs and spaces', (t) => {
      let dedented = dedent(`
        \tUsage
        \t\t$ foo <input>
        \t
        \tCommands:
        \t\tstart, -s               Starts foo!
      `);
      t.equal(dedented, ' Usage\n     $ foo <input>\n \n Commands:\n     start, -s               Starts foo!\n      ');
      t.end();
    });
  });

  t.test('@flatten', (t) => {
    t.test('should only include alias and no shorthands', (t) => {
      let map = flatten({
        start: {
          alias: ['s', 'vroom']
        }
      });
      t.deepEqual(map, {
        start: {
          name: 'start'
        },
        s: {
          name: 'start'
        },
        vroom: {
          name: 'start'
        }
      });
      t.end();
    });

    t.test('should include alias and only default shorthand', (t) => {
      let map = flatten({
        rainbow: {
          type: 'boolean',
          alias: 'r'
        }
      }, true);
      t.deepEqual(map, {
        rainbow: {
          name: 'rainbow',
          type: 'boolean'
        },
        '-rainbow': {
          name: 'rainbow',
          type: 'boolean'
        },
        '-r': {
          name: 'rainbow',
          type: 'boolean'
        },
        r: {
          name: 'rainbow',
          type: 'boolean'
        }
      });
      t.end();
    });

    t.test('should include alias and all shorthands', (t) => {
      let map = flatten({
        rainbow: {
          type: 'boolean',
          alias: 'r'
        }
      }, true, true);
      t.deepEqual(map, {
        rainbow: {
          name: 'rainbow',
          type: 'boolean'
        },
        '-rainbow': {
          name: 'rainbow',
          type: 'boolean'
        },
        '--rainbow': {
          name: 'rainbow',
          type: 'boolean'
        },
        '-r': {
          name: 'rainbow',
          type: 'boolean'
        },
        '--r': {
          name: 'rainbow',
          type: 'boolean'
        },
        r: {
          name: 'rainbow',
          type: 'boolean'
        }
      });
      t.end();
    });

    t.test('should include alias and all shorthands with nested alias', (t) => {
      let map = flatten({
        rainbow: {
          type: 'boolean',
          alias: ['r', 'rain', 'bow']
        }
      }, true, true);
      t.deepEqual(map, {
        rainbow: {
          name: 'rainbow',
          type: 'boolean'
        },
        '-rainbow': {
          name: 'rainbow',
          type: 'boolean'
        },
        '--rainbow': {
          name: 'rainbow',
          type: 'boolean'
        },
        '-r': {
          name: 'rainbow',
          type: 'boolean'
        },
        '--r': {
          name: 'rainbow',
          type: 'boolean'
        },
        r: {
          name: 'rainbow',
          type: 'boolean'
        },
        '-rain': {
          name: 'rainbow',
          type: 'boolean'
        },
        '--rain': {
          name: 'rainbow',
          type: 'boolean'
        },
        rain: {
          name: 'rainbow',
          type: 'boolean'
        },
        '-bow': {
          name: 'rainbow',
          type: 'boolean'
        },
        '--bow': {
          name: 'rainbow',
          type: 'boolean'
        },
        bow: {
          name: 'rainbow',
          type: 'boolean'
        }
      });
      t.end();
    });
  });

});
