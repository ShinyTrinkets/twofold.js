import test from 'ava'
import xfold from '../src'
import helpers from '../src/functions'
//
// General testing of the render function
//
test('simple increment render', async t => {
  const nr = 999
  const txt = `qwerty <replace-increment>${nr}</replace-increment> ...`
  let tmp = xfold.renderText(txt)
  t.not(tmp, txt)
  t.is(tmp, `qwerty <replace-increment>${nr + 1}</replace-increment> ...`)
})

test('simple random integer', async t => {
  // Also check camelCase-ing template names
  const txt1 = `random <replace-randomInt></replace-randomInt> ...`
  const txt2 = `random <replace-random-int></replace-random-int> ...`
  const tmp1 = xfold.renderText(txt1)
  const tmp2 = xfold.renderText(txt2)
  t.not(tmp1, txt1)
  t.not(tmp2, txt2)
  t.true(tmp1.length > txt1.length)
  t.true(tmp2.length > txt2.length)
})

test('simple sort render', async t => {
  const li = ['z', 'x', 'a', 'm']
  const txt = `qwerty <replace-sort-lines>\n${li.join('\n')}</replace-sort-lines> ...`
  const tmp = xfold.renderText(txt)
  t.not(tmp, txt)
  li.sort()
  t.is(tmp, `qwerty <replace-sort-lines>\n${li.join('\n')}</replace-sort-lines> ...`)
})

test('emoji clock render', async t => {
  const txt = `clock <replace-emojiClock></replace-emojiClock> ...`
  let tmp = xfold.renderText(txt, { date: new Date(2012, 11, 21, 11, 11) })
  t.not(tmp, txt)
  t.true(tmp.indexOf('🕚') > 0)

  tmp = xfold.renderText(txt, { date: new Date(2012, 11, 21, 11, 15), showHalf: false })
  t.true(tmp.indexOf('🕚') > 0)

  tmp = xfold.renderText(txt, { date: new Date(2012, 11, 21, 12, 46), showHalf: false })
  t.true(tmp.indexOf('🕛') > 0)
})

test('separated sort render', async t => {
  const li1 = ['z', 'a', 'm']
  const li2 = ['4', '2']
  const li3 = ['x2', 'x1']
  let blob = li1.join('\n') + '\n\n' + li2.join('\n') + '\n\n' + li3.join('\n')
  let txt = `qwerty <replace-sort>\n${blob}</replace-sort> ...`
  let tmp = xfold.renderText(txt, {}, { sort: helpers.sortLines })
  t.not(tmp, txt)
  t.is(tmp.length, txt.length)

  blob += '\n\n'
  txt = `qwerty <replace-sort>\n${blob}</replace-sort> ...`
  tmp = xfold.renderText(txt, {}, { sort: helpers.sortLines })
  t.not(tmp, txt)
  t.is(tmp.length, txt.length)

  blob = '\n\n' + blob
  txt = `qwerty <replace-sort>\n${blob}</replace-sort> ...`
  tmp = xfold.renderText(txt, {}, { sort: helpers.sortLines })
  t.not(tmp, txt)
  t.is(tmp.length, txt.length)
})

test('mixed tags', async t => {
  // This test validates a lot of usecases for multiple mixed tags
  // Wrong tags, wrong helper names
  const txt =
    `qaz <mumu /> ...\n` +
    `rand slice <replace-random-slice />\n` +
    `xyz <replace-xyz />\n` +
    `rand int <replace-random-int>\n</replace-random-int>\n` +
    `wrong <replace-wrong />`
  const tmp = xfold.renderText(txt)
  t.not(txt, tmp)
  const lines = tmp.split(/[\n]/)
  // Not touched
  t.is(lines[0], 'qaz <mumu /> ...')
  t.is(lines[2], 'xyz <replace-xyz />')
  t.is(lines[4], 'wrong <replace-wrong />')
  // Replaced
  t.is(lines[1].indexOf('rand slice '), 0)
  t.is(lines[1].length, 'rand slice '.length + 1)
  t.is(lines[3].indexOf('rand int '), 0)
})

test('custom single tag', async t => {
  let tmp
  const mumu = () => 'ok'
  tmp = xfold.renderText('<mumu />', {}, { mumu })
  t.is(tmp, 'ok')
  // Test open and close tag for single
  tmp = xfold.renderText('<mumu />', {}, { mumu }, { openTag: '{', closeTag: '}' })
  t.is(tmp, '<mumu />')
  tmp = xfold.renderText('{mumu /}', {}, { mumu }, { openTag: '{', closeTag: '}' })
  t.is(tmp, 'ok')
  // Test last stopper for single
  // Because it's a regex, it needs to be escaped
  tmp = xfold.renderText('<mumu />', {}, { mumu }, { lastStopper: '[?]' })
  t.is(tmp, '<mumu />')
  tmp = xfold.renderText('<mumu ?>', {}, { mumu }, { lastStopper: '[?]' })
  t.is(tmp, 'ok')
  tmp = xfold.renderText('< mumu ? >', {}, { mumu }, { lastStopper: '[?]' })
  t.is(tmp, 'ok')
  // Full test
  const cfg = { openTag: '{%', closeTag: '%}', lastStopper: '[?]' }
  tmp = xfold.renderText('<mumu />', {}, { mumu }, cfg)
  t.is(tmp, '<mumu />')
  tmp = xfold.renderText('{% mumu ? %}', {}, { mumu }, cfg)
  t.is(tmp, 'ok')
})

test('custom double tag', async t => {
  let tmp, cfg
  const mumu = () => 'ok'
  tmp = xfold.renderText('<replace-mumu></replace-mumu>', {}, { mumu })
  t.is(tmp, '<replace-mumu>ok</replace-mumu>')
  // Test open and close tag
  cfg = { openTag: '{', closeTag: '}' }
  tmp = xfold.renderText('<replace-mumu></replace-mumu>', {}, { mumu }, cfg)
  t.is(tmp, '<replace-mumu></replace-mumu>')
  tmp = xfold.renderText('{replace-mumu}{/replace-mumu}', {}, { mumu }, cfg)
  t.is(tmp, '{replace-mumu}ok{/replace-mumu}')
  // Test last stopper for double
  // Because it's a regex, it needs to be escaped
  cfg = { lastStopper: '[?]' }
  tmp = xfold.renderText('<replace-mumu></replace-mumu>', {}, { mumu }, cfg)
  t.is(tmp, '<replace-mumu></replace-mumu>')
  tmp = xfold.renderText('<replace-mumu><?replace-mumu>', {}, { mumu }, cfg)
  t.is(tmp, '<replace-mumu>ok<?replace-mumu>')
  // Full test
  cfg = { openTag: '{', closeTag: '}', firstStopper: '[>]', lastStopper: '[<]' }
  tmp = xfold.renderText('<replace-mumu></replace-mumu>', {}, { mumu }, cfg)
  t.is(tmp, '<replace-mumu></replace-mumu>')
  tmp = xfold.renderText('{replace-mumu>} {<replace-mumu}', {}, { mumu }, cfg)
  t.is(tmp, '{replace-mumu>}ok{<replace-mumu}')
})

test('single tag not found', async t => {
  const txt = `qwerty <mumu /> ...`
  const tmp = xfold.renderText(txt)
  t.is(txt, tmp)
})

test('function not found single tag', async t => {
  const txt = `qwerty <replace-xyz /> ...`
  const tmp = xfold.renderText(txt)
  t.is(txt, tmp)
})

test('double tag not found', async t => {
  const txt = `qwerty <mumu> </mumu> ...`
  const tmp = xfold.renderText(txt)
  t.is(txt, tmp)
})

test('function not found double tag', async t => {
  const txt = `qwerty <replace-xyz> </replace-xyz> ...`
  const tmp = xfold.renderText(txt)
  t.is(txt, tmp)
})
