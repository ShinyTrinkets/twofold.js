
import fs from 'fs'
import str from 'voca'
import test from 'ava'
import tfold from '../src'

function increment ({ textInside }) {
  /**
   * TwoFold helper: increment a number.
   */
  return parseInt(textInside) + 1
}

test('simple render', async t => {
  const nr = 999
  const txt = `qwerty <replace-increment>${nr}</replace-increment> ...`
  const tmp = tfold.renderText(txt, { increment })
  t.not(tmp, txt)
  t.is(tmp, `qwerty <replace-increment>${nr+1}</replace-increment> ...`)
})
