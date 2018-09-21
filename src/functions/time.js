function emojiDayNight (whatever, { date = null } = {}) {
  /**
   * Returns an emoji representing day or night.
   * Day=🏙 ; Night=🌃 ;
   */
  if (!date || typeof date !== 'object') {
     date = new Date()
   }
  const h = date.getHours()
  if (h <= 6 && h < 18) {
    return '🏙'
  } else {
    return '🌃'
  }
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
   * Returns the current time as emoji cliock.
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

module.exports = {
  emojiDayNight,
  emojiClock
}
