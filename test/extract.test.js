
import fs from 'fs'
import str from 'voca'
import test from 'ava'
import xfold from '../src'

test('no blocks found', async t => {
  const txt = fs.readFileSync(__dirname + '/fixtures/text0.md', {encoding: 'utf8'})
  const b = xfold.extractBlocks(txt)
  t.is(b.length, 0)
})

test('simple block', async t => {
  const nr = '99'
  const txt = `qwerty <replace-increment>${nr}</replace-increment> ...`
  const b = xfold.extractBlocks(txt)

  t.is(b.length, 1)
  t.is(b[0].name, 'increment')
  t.is(b[0].textInside, nr)
})

test('some blocks found', async t => {
  const txt = fs.readFileSync(__dirname + '/fixtures/text1.md', {encoding: 'utf8'})
  const b = xfold.extractBlocks(txt)
  // 3 correct blocks and 1 wrong
  t.is(b.length, 3)
  // blocks must be correctly extracted to form the original text
  for (const v of b) {
    t.is(v.textBefore + v.tagBefore + v.textInside + v.tagAfter + v.textAfter, txt)
  }
})
