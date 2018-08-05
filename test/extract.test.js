
import fs from 'fs'
import str from 'voca'
import test from 'ava'
import tfold from '../src'

test('no blocks found', async t => {
  const txt = fs.readFileSync(__dirname + '/fixtures/text0.md', {encoding: 'utf8'})
  const b = tfold.extractBlocks(txt)
  t.is(Object.keys(b).length, 0)
})

test('some blocks found', async t => {
  const txt = fs.readFileSync(__dirname + '/fixtures/text1.md', {encoding: 'utf8'})
  const b = tfold.extractBlocks(txt)
  // 3 correct blocks and 1 wrong
  t.is(Object.keys(b).length, 3)
  // blocks must be correctly extracted to form the original text
  for (const i of Object.keys(b)) {
    const v = b[i]
    t.is(v.textBefore + v.textInside + v.textAfter, txt)
  }
})
