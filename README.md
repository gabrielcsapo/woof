<div align="center">
  <h1>woof</h1>
  <small>command line applications made as easy as fetch</small>
  <br/>
  <br/>
  <img height="100px" src="./docs/woof.svg"/>
  <br/>
  <br/>
</div>

[![Npm Version](https://img.shields.io/npm/v/woof.svg)](https://www.npmjs.com/package/woof)
[![Build Status](https://travis-ci.org/gabrielcsapo/woof.svg?branch=master)](https://travis-ci.org/gabrielcsapo/woof)
[![Coverage Status](https://lcov-server.gabrielcsapo.com/badge/github%2Ecom/gabrielcsapo/woof.svg)](https://lcov-server.gabrielcsapo.com/coverage/github%2Ecom/gabrielcsapo/woof)
[![Dependency Status](https://starbuck.gabrielcsapo.com/badge/github/gabrielcsapo/woof/status.svg)](https://starbuck.gabrielcsapo.com/github/gabrielcsapo/woof)
[![devDependency Status](https://starbuck.gabrielcsapo.com/badge/github/gabrielcsapo/woof/dev-status.svg)](https://starbuck.gabrielcsapo.com/github/gabrielcsapo/woof#info=devDependencies)
[![npm](https://img.shields.io/npm/dt/woof.svg)]()
[![npm](https://img.shields.io/npm/dm/woof.svg)]()

## Installation

```
npm install woof
```

## Usage

```javascript
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
});

console.log(cli);
```
