import test from 'ava'
import func from '../src/functions'

test('random int function', async t => {
  for (let i = 0; i < 10; i++) {
    const r = func.randomInt(null, { min: '5', max: '9' })
    t.true(5 <= r <= 9)
  }
})

test('random float function', async t => {
  for (let i = 0; i < 10; i++) {
    const r = func.randomFloat(null, { min: '0.5', max: '5.0' })
    t.true(0.5 <= r <= 5.0)
  }
})

test('yes or no function', async t => {
  for (let i = 0; i < 10; i++) {
    const r = func.yesOrNo().toLowerCase()
    t.regex(r, /yes|no/)
  }
})

test('left or right function', async t => {
  for (let i = 0; i < 10; i++) {
    const r = func.leftOrRight(0, { emoji: false }).toLowerCase()
    t.regex(r, /left|right/)
  }
})

test('up or down function', async t => {
  for (let i = 0; i < 10; i++) {
    const r = func.upOrDown(0, { emoji: false }).toLowerCase()
    t.regex(r, /up|down/)
  }
})
