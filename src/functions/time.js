/**
  * Helper that returns day or night.
  */
function dayOrNight(whatever, { date = null, splitHour = 6 } = {}) {
  if (!date || typeof date !== 'object') {
    date = new Date()
  }
  const h = date.getHours()
  if (h > splitHour && h <= splitHour + 12) {
    return 'day'
  } else {
    return 'night'
  }
}

/**
  * Returns an emoji representing day or night.
  * Day=☀️ ; Night=🌙 ;
  */
function emojiSunMoon(whatever, { date = null, splitHour = 6 } = {}) {
  const dn = dayOrNight(whatever, { date, splitHour })
  if (dn === 'day') {
    return '☀️'
  } else {
    return '🌙'
  }
}

/**
  * Returns an emoji representing day or night.
  * Day=🏙 ; Night=🌃 ;
  */
function emojiDayNight(whatever, { date = null, splitHour = 6 } = {}) {
  const dn = dayOrNight(whatever, { date, splitHour })
  if (dn === 'day') {
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

/**
  * Returns the current time as emoji cliock.
  */
function emojiClock(whatever, { date = null, showHalf = true } = {}) {
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

function zodiacSign(whatever, { date = null } = {}) {
  const zodSigns = [
    'Capricorn',
    'Aquarius',
    'Pisces',
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius'
  ]
  if (!date || typeof date !== 'object') {
    date = new Date()
  }
  const day = date.getDate()
  const month = date.getMonth()
  let sign = ''
  switch (month) {
    case 0:
      // January
      if (day < 20) sign = zodSigns[0]
      else sign = zodSigns[1]
      break
    case 1:
      // February
      if (day < 19) sign = zodSigns[1]
      else sign = zodSigns[2]
      break
    case 2:
      // March
      if (day < 21) sign = zodSigns[2]
      else sign = zodSigns[3]
      break
    case 3:
      // April
      if (day < 20) sign = zodSigns[3]
      else sign = zodSigns[4]
      break
    case 4:
      // May
      if (day < 21) sign = zodSigns[4]
      else sign = zodSigns[5]
      break
    case 5:
      // June
      if (day < 21) sign = zodSigns[5]
      else sign = zodSigns[6]
      break
    case 6:
      // July
      if (day < 23) sign = zodSigns[6]
      else sign = zodSigns[7]
      break
    case 7:
      // August
      if (day < 23) sign = zodSigns[7]
      else sign = zodSigns[8]
      break
    case 8:
      // September
      if (day < 23) sign = zodSigns[8]
      else sign = zodSigns[9]
      break
    case 9:
      // October
      if (day < 23) sign = zodSigns[9]
      else sign = zodSigns[10]
      break
    case 10:
      // November
      if (day < 22) sign = zodSigns[10]
      else sign = zodSigns[11]
      break
    case 11:
      // December
      if (day < 22) sign = zodSigns[11]
      else sign = zodSigns[0]
      break
  }
  return sign
}

module.exports = {
  dayOrNight,
  emojiDayNight,
  emojiSunMoon,
  emojiClock,
  zodiacSign
}
