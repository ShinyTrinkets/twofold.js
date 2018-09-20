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

function randomChoice (choices) {
  const index = Math.floor(Math.random() * choices.length)
  return choices[index]
}

function blackOrWhite () {
  /**
   * TwoFold helper: random black or white.
   */
  return randomChoice(['◻️', '◼️'])
}

function leftOrRight () {
  /**
   * TwoFold helper: random left or right.
   */
  return randomChoice(['←', '→'])
}

function upOrDown () {
  /**
   * TwoFold helper: random up or down.
   */
  return randomChoice(['↑', '↓'])
}

function randomSlice () {
  /**
   * TwoFold helper: random quadrant.
   */
  return randomChoice(['◴', '◵', '◶', '◷'])
}

function randomDice () {
  /**
   * TwoFold helper: random die from 1 to 6.
   */
  return randomChoice(['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'])
}

function randomCard () {
  /**
   * TwoFold helper: random game card.
   * Aces, Twos, Threes, Fours, Fives, Sixes, Sevens, Eights, Nines, Tens,
   * Jacks, Queens, Kings
   * Spades (♠) Hearts (♥) Diamonds (♦) Clubs (♣)
   */
  const suits = ['♤', '♡', '♢', '♧']
  const cards = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']
  const all = []
  for (const c of cards) {
    for (const s of suits) {
      all.push(`${c}${s}`)
    }
  }
  return randomChoice(all)
}

// Fix hours
const fixHours = {
  0: '🕛',
  1: '🕐',
  2: '🕑',
  3: '🕒',
  4: '🕓',
  5: '🕓',
  6: '🕕',
  7: '🕖',
  8: '🕗',
  9: '🕘',
  10: '🕙',
  11: '🕚',
  12: '🕛'
}
// ... and a half
const halfHours = {
  0: '🕧',
  1: '🕜',
  2: '🕝',
  3: '🕞',
  4: '🕟',
  5: '🕠',
  6: '🕡',
  7: '🕢',
  8: '🕣',
  9: '🕤',
  10: '🕥',
  11: '🕦',
  12: '🕧'
}

function emojiClock (whatever, { date = null, showHalf = true } = {}) {
  /**
   * TwoFold helper: random quadrant.
   */
  if (!date || typeof date !== 'object') {
    date = new Date()
  }
  let h = date.getHours()
  if (h > 12) {
    h -= 12
  }
  const m = date.getMinutes()
  let result = fixHours[h]
  if (m >= 15 && m <= 45) {
    if (showHalf) {
      result = halfHours[h]
    }
  } else if (m > 45) {
    h += 1
    if (h > 12) {
      h = 0
    }
    result = fixHours[h]
  }
  return result
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
  leftOrRight,
  upOrDown,
  randomSlice,
  randomDice,
  randomCard,
  emojiClock,
  sortLines
}
