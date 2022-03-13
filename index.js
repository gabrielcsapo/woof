const path = require('path')

const { dedent, flatten } = require('./util')

/**
 * takes a help message and options and parses argv
 * @param  {String} helpMessage         - help message to be displayed with `--help` or `help`
 * @param  {String} defaultCommand      - the default command to set if no command has been set
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
function Woof (helpMessage, options = {}) {
  delete require.cache[__filename]

  const program = {}
  const { version, defaultCommand, args = process.argv.slice(2), flags = {}, commands = {} } = options

  // sets the defaults
  for (const flag in flags) {
    if (flags[flag].default) {
      program[flag] = flags[flag].default
    }
  }

  // make the flag and command objects a hashmap for easy access
  const flagMap = flatten(flags, true, true)
  const commandMap = flatten(commands, true)
  const versionMap = { 'version': true, '--version': true }
  const helpMap = { 'help': true, '--help': true }

  // loop through the args, either command line or given
  let arg = ''
  let foundCommand = false

  while ((arg = args.shift()) !== undefined) {
    if (arg.indexOf('=') > -1) {
      const parsed = arg.split('=')

      // add the values to the original array
      args.push(parsed[0])
      args.push(parsed[1])

      // continue from the next true argument
      continue
    }

    if (helpMap[arg]) {
      program['help'] = true
      // Use the predefined help message to render a help screen
      process.stdout.write(`\n${dedent(helpMessage)}\n`)
    }

    if (versionMap[arg]) {
      program['version'] = true

      // If the version is provided, just use that
      if (version) {
        process.stdout.write(`v${version}\n`)
      } else {
        // try to get the version from the current applications package.json
        try {
          const parentDir = path.dirname(module.parent.filename);

          process.stdout.write(`v${require(`${parentDir}/package.json`).version}\n`)
        } catch (ex) {
          process.stdout.write('v?\n')
        }
      }
    }

    // check the flag maps see if it exists
    // since we are working off a stack, the next value is always 0, so we can shift the next value to get it
    if (flagMap[arg]) {
      let { type, name } = flagMap[arg]

      switch (type) {
        case 'string':
          program[name] = args.shift()
          break
        case 'integer':
          program[name] = parseInt(args.shift())
          break
        case 'list':
          program[name] = args.shift().split(',')
          break
        case 'boolean':
        default:
          program[name] = true
          break
      }

      // they have passed in the validate argument and want to validate the value that we have collected
      if (typeof flagMap[arg]['validate'] === 'function') {
        const isValid = flagMap[arg]['validate'](program[name])

        // isValid is boolean and is falsey that will trigger the default throw logic
        if (typeof isValid === 'boolean' && !isValid) {
          program['error'] = `the value passed into ${arg} is not acceptable: ${program[name]}`
        }

        // isValid is a string that was passed by the validate function
        if (typeof isValid === 'string') {
          program['error'] = new Error(isValid)
        }
      }
    }

    if (commandMap[arg]) {
      foundCommand = true

      program[commandMap[arg].name] = true
    }
  }

  if (!foundCommand && defaultCommand) {
    program[defaultCommand] = true
  }

  return program
};

module.exports = Woof
