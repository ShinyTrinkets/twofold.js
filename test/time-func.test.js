import test from 'ava'
import func from '../src/functions/index.js'

test('day or night time', async t => {
    let d
    d = { date: '01 Dec 2012 11:11 GMT' }
    t.is(func.dayOrNight(0, d), 'day')
    t.is(func.emojiSunMoon(0, d), '☀️')
    t.is(func.emojiDayNight(0, d), '🏙')
    d = { date: '01 Dec 2012 21:21 GMT' }
    t.is(func.dayOrNight(0, d), 'night')
    t.is(func.emojiSunMoon(0, d), '🌙')
    t.is(func.emojiDayNight(0, d), '🌃')
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
