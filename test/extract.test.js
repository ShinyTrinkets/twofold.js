import fs from 'fs'
import test from 'ava'
import xfold from '../src'

test('no blocks found', async t => {
  const txt = fs.readFileSync(__dirname + '/fixtures/text0.md', { encoding: 'utf8' })
  const b = xfold.extractBlock(txt)
  t.is(b, null)
})

test('some blocks found', async t => {
  let txt = fs.readFileSync(__dirname + '/fixtures/text1.md', { encoding: 'utf8' })
  let b
  // blocks must be correctly extracted to form the original text
  b = xfold.extractBlock(txt)
  t.is(b.textBefore + b.tagBefore + b.textInside + b.tagAfter + b.textAfter, txt)

  txt = b.textAfter
  b = xfold.extractBlock(txt)
  t.is(b.textBefore + b.tagBefore + b.textInside + b.tagAfter + b.textAfter, txt)

  txt = b.textAfter
  b = xfold.extractBlock(txt)
  t.is(b.textBefore + b.tagBefore + b.textInside + b.tagAfter + b.textAfter, txt)
})
