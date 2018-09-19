function multiply ({ textInside }, { number = 1 } = {}) {
  /**
   * TwoFold helper: multiply a number.
   * The number can be any integer, or float.
   */
  return parseInt(textInside) * number
}

function increment ({ textInside }, { number = 1 } = {}) {
  /**
   * TwoFold helper: increment a number.
   * The increment can be any integer, or float, positive or negative.
   */
  return parseInt(textInside) + number
}

function randomFloat (whatever, { min = 1, max = 100 } = {}) {
  /**
   * TwoFold helper: random float number.
   * Returns a pseudo-random float in the range min–max (inclusive of min, but not max).
   */
  return Math.random() * (max - min) + min
}

function randomInt (whatever, { min = 1, max = 100 } = {}) {
  /**
   * TwoFold helper: random integer number.
   * Returns a pseudo-random integer in the range min–max (inclusive of min, but not max).
   */
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

function randomChoice(choices) {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function blackOrWhite () {
  /**
   * TwoFold helper: random black or white.
   */
  return randomChoice(['◻️','◼️'])
}

function randomSlice () {
  /**
   * TwoFold helper: random quadrant.
   */
  return randomChoice(['◴', '◵', '◶', '◷'])
}

function sortLines ({ textInside }) {
  /**
   * TwoFold helper: sort lines of text alphabetically.
   */
  const lines = []
  const group = []
  for (let line of textInside.split(/[\r\n]/)) {
    group.push(line)
    if (!line) {
      group.sort()
      lines.push(group.join('\n'))
      group.length = 0
    }
  }
  if (group.length) {
    group.sort()
    lines.push(group.join('\n'))
  }
  return lines.join('\n')
}

module.exports = {
  multiply,
  increment,
  randomFloat,
  randomInt,
  blackOrWhite,
  randomSlice,
  sortLines
}
