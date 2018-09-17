
import fs from 'fs'
import str from 'voca'
import test from 'ava'
import xfold from '../src'
import helpers from '../src/helpers'

test('simple increment render', async t => {
  const nr = 999
  const txt = `qwerty <replace-increment>${nr}</replace-increment> ...`
  const tmp = xfold.renderText(txt, { increment: helpers.increment })
  t.not(tmp, txt)
  t.is(tmp, `qwerty <replace-increment>${nr+1}</replace-increment> ...`)
})

test('simple sort render', async t => {
  const nr = 999
  const txt = `qwerty <replace-sort>z\nx\n\na\nm</replace-sort> ...`
  const tmp = xfold.renderText(txt, { sort: helpers.sort })
  t.not(tmp, txt)
  t.is(tmp, `qwerty <replace-sort>\na\nm\nx\nz</replace-sort> ...`)
})
