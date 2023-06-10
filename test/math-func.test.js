import test from 'ava'
import * as func from '../src/functions/math.js'

test('math increment function', async t => {
    const nr = 999
    const txt = { text: nr.toString() }
    t.is(func.increment(txt), nr + 1)
    t.is(func.increment(txt, { nr: '-10' }), nr - 10)
})

test('math increment float function', async t => {
    const nr = 3.1415
    const txt = { text: nr.toString() }
    t.is(func.increment(txt), nr + 1)
    t.is(func.increment(txt, { nr: '-2.5' }), nr - 2.5)
})

test('math multiply function', async t => {
    const nr = 5
    const txt = { text: nr.toString() }
    t.is(func.multiply(txt), nr * 1)
    t.is(func.multiply(txt, { nr: '-3' }), nr * -3)
})

test('math multiply float function', async t => {
    const nr = 3.14
    const txt = { text: nr.toString() }
    t.is(func.multiply(txt), nr)
    t.is(func.multiply(txt, { nr: '-2.7' }), nr * -2.7)
})
