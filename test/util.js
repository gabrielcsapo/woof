const test = require('tape');

const { dedent } = require('../util');

test('util', (t) => {
  t.plan(1);

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

});
