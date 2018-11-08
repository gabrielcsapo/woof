function dedent (str) {
  let foundCharacter = false
  let maxSize = 0

  let parts = str.split('')

  // finding the trailing spaces and turn tabs into spaces
  parts = parts.map((c) => {
    if (c === '\n' && !foundCharacter) return '' // ignore new lines
    if (c === ' ' && !foundCharacter) {
      maxSize += 1
      return ' '
    }
    if (c === '\t' && !foundCharacter) {
      maxSize += 4
      return '    '
    }
    foundCharacter = true
    if (c === '\t') {
      return '    '
    }
    return c
  })

  let regex = new RegExp(`^${new Array(maxSize).join(' ')}`)

  return parts.join('').split('\n').map((line) => {
    return line.replace(regex, '')
  }).join('\n')
}

/**
 * turns alias keys into a map
 * @method flatten
 * @param  {Array<Object>} flags - keys defined by the user that need to be mapped
 * @param  {Boolean} allowShorthand - allows the option to use short hand syntax such as - before the arg
 * @param  {Boolean} allowExtendedShorthand - allows the option to use short hand syntax such as -- before the arg
 * @return {Object} - hashmap of mapped keys
 */
function flatten (flags, allowShorthand, allowExtendedShorthand) {
  let map = {}
  Object.keys(flags).forEach((k) => {
    const { alias, type, validate } = flags[k]
    let value = { name: k }
    if (type) value.type = type
    if (validate) value.validate = validate

    // include the name as value that can be invoked
    // also include the shorthands if allowed
    map[k] = value
    if (allowShorthand) map[`-${k}`] = value
    if (allowExtendedShorthand) map[`--${k}`] = value

    // If the alias is a string we don't need to map anything
    if (typeof alias === 'string') {
      if (allowShorthand) map[`-${alias}`] = value
      if (allowExtendedShorthand) map[`--${alias}`] = value

      map[alias] = value // the default alias is included
    }
    // If the alias is an array, we should map over the values and set them
    if (Array.isArray(alias)) {
      alias.forEach((a) => {
        if (allowShorthand) map[`-${a}`] = value
        if (allowExtendedShorthand) map[`--${a}`] = value

        // the default alias is included
        map[a] = value
      })
    }
  })
  return map
}

module.exports = {
  dedent,
  flatten
}
