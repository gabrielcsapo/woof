const path = require('path');

const { dedent, flatten } = require('./util');

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
  let { version, args=process.argv.slice(2), flags={}, commands={} } = options;

  // sets the defaults
  Object.keys(flags).forEach((flag) => {
    if(flags[flag].default) {
      program[flag] = flags[flag].default;
    }
  });

  // make the flag and command objects a hashmap for easy access
  let flagMap = flatten(flags, true, true);
  let commandMap = flatten(commands, true);
  let versionMap = { 'version': true, '--version': true };
  let helpMap = { 'help': true, '--help': true };

  // loop through the args, either command line or given
  args.forEach((arg, i) => {
    // The user has requested either of these values and further arguments should not be parsed
    if(program['version'] || program['help']) return;

    if(helpMap[arg]) {
      program['help'] = true;
      // Use the predefined help message to render a help screen
      process.stdout.write(`\n${dedent(helpMessage)}\n`);
    }
    if(versionMap[arg]) {
      program['version'] = true;

      // If the version is provided, just use that
      if(version) process.stdout.write(`v${version}\n`);
      // try to get the version from the current applications package.json
      try {
        process.stdout.write(`v${require(`${parentDir}/package.json`).version}\n`);
      } catch(ex) {
        process.stdout.write('v?\n');
      }
    }

    // check the flag maps see if it exists
    if(flagMap[arg]) {
      let { type, name } = flagMap[arg];
      switch(type) {
        case 'string':
          program[name] = args[i + 1];
        break;
        case 'integer':
          program[name] = parseInt(args[i + 1]);
        break;
        case 'boolean':
        default:
          program[name] = true;
        break;
      }
    }

    if(commandMap[arg]) program[commandMap[arg].name] = true;
  });

  return program;
};
