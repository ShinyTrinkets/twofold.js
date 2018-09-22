import test from 'ava'
import func from '../src/functions'

test('day or night time', async t => {
  let d
  d = { date: new Date(2012, 11, 21, 11, 11) }
  t.is(func.dayOrNight(0, d), 'day')
  d = { date: new Date(2012, 11, 21, 20) }
  t.is(func.dayOrNight(0, d), 'night')
})

test('emoji clock', async t => {
  let d
  d = { date: new Date(2012, 11, 21, 11) }
  t.is(func.emojiClock(0, d), '🕚')

  d = { date: new Date(2012, 11, 21, 11, 15) }
  t.is(func.emojiClock(0, d), '🕦')

  d = { date: new Date(2012, 11, 21, 11, 46) }
  t.is(func.emojiClock(0, d), '🕛')

  d = { date: new Date(2012, 11, 21, 11, 15), showHalf: false }
  t.is(func.emojiClock(0, d), '🕚')

  d = { date: new Date(2012, 11, 21, 12, 46), showHalf: false }
  t.is(func.emojiClock(0, d), '🕛')
})

test('horoscop sign', async t => {
  let d
  d = { date: new Date(2012, 0, 23, 11) }
  t.is(func.zodiacSign(0, d), 'Aquarius')
  d = { date: new Date(2012, 2, 23, 11) }
  t.is(func.zodiacSign(0, d), 'Aries')
  d = { date: new Date(2012, 6, 23, 11) }
  t.is(func.zodiacSign(0, d), 'Leo')
})
