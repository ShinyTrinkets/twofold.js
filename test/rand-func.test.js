import test from 'ava'
import func from '../src/functions'

test('random int function', async t => {
  for (let i = 0; i < 20; i++) {
    const r = func.randomInt(null, { min: '0', max: '9' })
    t.true(0 <= r <= 9)
  }
})

test('random float function', async t => {
  for (let i = 0; i < 20; i++) {
    const r = func.randomFloat(null, { min: '0.1', max: '5.0' })
    t.true(0.1 <= r <= 5.0)
  }
})

test('yes or no function', async t => {
  const expected = { yes: 1, no: 1 }
  const results = {}
  for (let i = 0; i < 10; i++) {
    const r = func.yesOrNo().toLowerCase()
    results[r] = 1
  }
  t.deepEqual(expected, results)
})

test('left or right function', async t => {
  const expected = { left: 1, right: 1 }
  const results = {}
  for (let i = 0; i < 10; i++) {
    const r = func.leftOrRight(0, { emoji: false }).toLowerCase()
    results[r] = 1
  }
  t.deepEqual(expected, results)
})

test('up or down function', async t => {
  const expected = { up: 1, down: 1 }
  const results = {}
  for (let i = 0; i < 10; i++) {
    const r = func.upOrDown(0, { emoji: false }).toLowerCase()
    results[r] = 1
  }
  t.deepEqual(expected, results)
})
