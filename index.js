const path = require('path');

const { dedent } = require('./util');

/**
 * takes a help message and options and parses argv
 * @param  {String} helpMessage         - help message to be displayed with `--help` or `help`
 * @param  {Object} options             - contains rules to parse args
 * @param  {Object} options.args        - passed to the parser instead of process.argv
 * @param  {Object} options.commands    - The key is the flag name and the value is an object with the structure of
   {
     type: Type of value. (string|boolean)
     alias: Usually used to define a short flag alias.
     default: Default value when the flag is not specified.
   }
 * @param  {Object} options.flags       - contains a key value pair to parse args
 * @return {Object} - returns an object that keys match flag or command names
 */
module.exports = function Woof(helpMessage, options={}) {
  delete require.cache[__filename];
  const parentDir = path.dirname(module.parent.filename);

  let program = {};
  let { args=process.argv.slice(2), flags={}, commands={} } = options;

  // sets the defaults
  Object.keys(flags).forEach((flag) => {
    if(flags[flag].default) {
      program[flag] = flags[flag].default;
    }
  });

  args.forEach((arg, i) => {
    if(arg === 'help' || arg == '--help') {
      console.log(`\n${dedent(helpMessage)}`); // eslint-disable-line
      process.exit(0);
    }
    if(arg === 'version' || arg === '--version') {
      try {
        console.log(`v${require(`${parentDir}/package.json`).version}`); // eslint-disable-line
      } catch(ex) {
        console.log('v?'); // eslint-disable-line
      }
      process.exit(0);
    }

    Object.keys(flags).forEach((flag) => {
      if(`--${flag}` === arg || `-${flags[flag].alias}` === arg) {
        switch(flags[flag].type) {
          case 'string':
            program[flag] = args[i + 1];
          break;
          case 'integer':
            program[flag] = parseInt(args[i + 1]);
          break;
          case 'boolean':
          default:
            program[flag] = true;
          break;
        }
      }
    });
    Object.keys(commands).forEach((command) => {
      if(`${command}` === arg || `-${command.alias}` === arg) {
        program[command] = true;
      }
    });
  });

  return program;
};
