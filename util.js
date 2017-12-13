module.exports.dedent = function dedent(str) {
  let foundCharacter = false;
  let maxSize = 0;

  let parts = str.split('');

  // finding the trailing spaces and turn tabs into spaces
  parts = parts.map((c) => {
    if(c == '\n' && !foundCharacter) return ''; // ignore new lines
    if(c === ' ' && !foundCharacter) {
      maxSize += 1;
      return ' ';
    }
    if(c == '\t' && !foundCharacter) {
      maxSize += 4;
      return '    ';
    }
    foundCharacter = true;
    if(c == '\t') {
      return '    ';
    }
    return c;
  });

  let regex = new RegExp(`^${new Array(maxSize).join(' ')}`);

  return parts.join('').split('\n').map((line) => {
    return line.replace(regex, '');
  }).join('\n');
};
