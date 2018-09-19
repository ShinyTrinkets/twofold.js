
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
  const li = ['z', 'x', 'a', 'm']
  const txt = `qwerty <replace-sort>\n${li.join("\n")}</replace-sort> ...`
  const tmp = xfold.renderText(txt, { sort: helpers.sortLines })
  t.not(tmp, txt)
  li.sort()
  t.is(tmp, `qwerty <replace-sort>\n${li.join("\n")}</replace-sort> ...`)
})

test('separated sort render', async t => {
  const li1 = ['z', 'a', 'm']
  const li2 = ['4', '2']
  const li3 = ['x2', 'x1']
  let blob = li1.join('\n') + '\n\n' + li2.join('\n') + '\n\n' + li3.join('\n')
  let txt = `qwerty <replace-sort>\n${blob}</replace-sort> ...`
  let tmp = xfold.renderText(txt, { sort: helpers.sortLines })
  t.not(tmp, txt)
  t.is(tmp.length, txt.length)

  blob += '\n\n'
  txt = `qwerty <replace-sort>\n${blob}</replace-sort> ...`
  tmp = xfold.renderText(txt, { sort: helpers.sortLines })
  t.not(tmp, txt)
  t.is(tmp.length, txt.length)

  blob = '\n\n' + blob
  txt = `qwerty <replace-sort>\n${blob}</replace-sort> ...`
  tmp = xfold.renderText(txt, { sort: helpers.sortLines })
  t.not(tmp, txt)
  t.is(tmp.length, txt.length)
})
