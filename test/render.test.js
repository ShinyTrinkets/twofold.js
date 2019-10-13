import test from 'ava'
import xfold from '../src'
import helpers from '../src/functions'
//
// General testing of the render function
//
test('simple increment render', async t => {
  const nr = 999
  let txt = `qwerty <increment>${nr}</increment> ...`
  let tmp = xfold.renderText(txt)
  t.not(tmp, txt)
  t.is(tmp, `qwerty <increment>${nr + 1}</increment> ...`)
  txt = `qwerty <increment consume=true>${nr}</increment> ...`
  tmp = xfold.renderText(txt)
  t.not(tmp, txt)
  t.is(tmp, `qwerty ${nr + 1} ...`)
})

test('simple random integer', async t => {
  const txt1 = `random <randomInt/> ...`
  const txt2 = `random <randomInt/> ...`
  const tmp1 = xfold.renderText(txt1)
  const tmp2 = xfold.renderText(txt2)
  t.not(tmp1, txt1)
  t.not(tmp2, txt2)
  t.is(tmp1.indexOf('random'), 0)
  t.is(tmp2.indexOf('random'), 0)
  t.true(tmp1.length < txt1.length)
  t.true(tmp2.length < txt2.length)
})

test('render once', async t => {
  // Test without once
  let text = `random <randomInt></randomInt> ...`
  let tmp1 = xfold.renderText(text)
  t.not(text, tmp1)
  let tmp2 = xfold.renderText(tmp1)
  t.not(tmp1, tmp2)

  // Test with once=true
  text = `random <randomInt once=true></randomInt> ...`
  tmp1 = xfold.renderText(text)
  t.not(text, tmp1)
  tmp2 = xfold.renderText(tmp1)
  t.is(tmp1, tmp2)
})

test('simple sort render', async t => {
  const li = ['z', 'x', 'a', 'm']
  const txt = `qwerty <sortLines>\n${li.join('\n')}</sortLines> ...`
  const tmp = xfold.renderText(txt)
  t.not(tmp, txt)
  li.sort()
  t.is(tmp, `qwerty <sortLines>\n${li.join('\n')}</sortLines> ...`)
})

test('emoji clock render', async t => {
  const txt = `clock <emojiClock /> ...`
  let tmp = xfold.renderText(txt, { date: new Date(2012, 11, 21, 11, 11) })
  t.is(tmp.indexOf('clock'), 0)

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
  let txt = `... <sort>\n${blob}</sort> ...`
  let tmp = xfold.renderText(txt, {}, { sort: helpers.sortLines })
  t.not(tmp, txt)
  t.is(tmp.length, txt.length)
  t.is(tmp.indexOf('...'), 0)

  blob += '\n\n'
  txt = `??? <sort>\n${blob}</sort> ???`
  tmp = xfold.renderText(txt, {}, { sort: helpers.sortLines })
  t.not(tmp, txt)
  t.is(tmp.length, txt.length)
  t.is(tmp.indexOf('???'), 0)

  blob = '\r\n' + blob
  txt = `!!! <sort>\n${blob}</sort> !!!`
  tmp = xfold.renderText(txt, {}, { sort: helpers.sortLines })
  t.not(tmp, txt)
  t.is(tmp.length, txt.length)
  t.is(tmp.indexOf('!!!'), 0)
})

test('mixed tags', async t => {
  // This test validates a lot of usecases for multiple mixed tags
  // Wrong tags, wrong helper names
  const txt =
    `qaz <mumu /> ...\n` +
    `rand slice <randomSlice />\n` +
    `xyz <xyz />\n` +
    `rand int <randomInt>\n</randomInt>\n` +
    `wrong <wrong />`
  const tmp = xfold.renderText(txt)
  t.not(txt, tmp)
  const lines = tmp.split(/[\n]/)
  // Not touched
  t.is(lines[0], 'qaz <mumu /> ...')
  t.is(lines[2], 'xyz <xyz />')
  t.is(lines[4], 'wrong <wrong />')
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
  tmp = xfold.renderText('<mumu />', {}, { mumu }, { lastStopper: '?' })
  t.is(tmp, '<mumu />')
  tmp = xfold.renderText('<mumu ?>', {}, { mumu }, { lastStopper: '?' })
  t.is(tmp, 'ok')
  // Full test
  const cfg = { openTag: '{', closeTag: '}', lastStopper: '?' }
  tmp = xfold.renderText('<mumu />', {}, { mumu }, cfg)
  t.is(tmp, '<mumu />')
  tmp = xfold.renderText('{mumu ?}', {}, { mumu }, cfg)
  t.is(tmp, 'ok')
})

test('custom double tag', async t => {
  let tmp, cfg
  const mumu = () => 'ok'
  tmp = xfold.renderText('<mumu></mumu>', {}, { mumu })
  t.is(tmp, '<mumu>ok</mumu>')
  // Test open and close tag
  cfg = { openTag: '{', closeTag: '}' }
  tmp = xfold.renderText('<mumu></mumu>', {}, { mumu }, cfg)
  t.is(tmp, '<mumu></mumu>')
  tmp = xfold.renderText('{mumu}{/mumu}', {}, { mumu }, cfg)
  t.is(tmp, '{mumu}ok{/mumu}')
  // Test last stopper for double
  cfg = { lastStopper: '?' }
  tmp = xfold.renderText('<mumu></mumu>', {}, { mumu }, cfg)
  t.is(tmp, '<mumu></mumu>')
  tmp = xfold.renderText('<mumu><?mumu>', {}, { mumu }, cfg)
  t.is(tmp, '<mumu>ok<?mumu>')
  // Full test
  cfg = { openTag: '{', closeTag: '}', lastStopper: '<' }
  tmp = xfold.renderText('<mumu></mumu>', {}, { mumu }, cfg)
  t.is(tmp, '<mumu></mumu>')
  tmp = xfold.renderText('{mumu} {<mumu}', {}, { mumu }, cfg)
  t.is(tmp, '{mumu}ok{<mumu}')
})

test('deep increment consume render', async t => {
  const nr = 997
  let txt = 'qwerty <increment consume=true><increment consume=true><increment consume=true>'
  txt += `${nr}</increment></increment></increment>`
  let tmp = xfold.renderText(txt)
  t.not(tmp, txt)
  t.is(tmp, `qwerty ${nr + 3}`)
})

test('deep increment render', async t => {
  const nr = 997
  let txt = 'qwerty <increment><increment consume=true><increment consume=true>'
  txt += `${nr}</increment></increment></increment>`
  let tmp = xfold.renderText(txt)
  t.not(tmp, txt)
  t.is(tmp, `qwerty <increment>${nr + 3}</increment>`)
})

test('deep custom function render', async t => {
  let tmp = ''
  let calls = 0
  const mumu = function () {
    calls += 1
    return 'ok'
  }
  tmp = xfold.renderText('<mumu><mumu></mumu></mumu>', {}, { mumu })
  t.is(tmp, '<mumu>ok</mumu>')
  t.is(calls, 2) // evaluate calls

  calls = 0
  tmp = xfold.renderText('<mumu><mumu><mumu></mumu></mumu></mumu>', {}, { mumu })
  t.is(tmp, '<mumu>ok</mumu>')
  t.is(calls, 3) // evaluate calls

  calls = 0
  tmp = xfold.renderText('<mumu><mumu /></mumu>', {}, { mumu })
  t.is(tmp, '<mumu>ok</mumu>')
  t.is(calls, 2) // evaluate calls
})

test('deep unknown function render', async t => {
  const tmp = xfold.renderText('<mumu><mumu><mumu>\n<increment consume=true>0</increment></mumu></mumu></mumu>')
  t.is(tmp, '<mumu><mumu><mumu>\n1</mumu></mumu></mumu>')
})

test('deep mix render', async t => {
  let txt = ''
  txt += '<div><span class="title">Hello</span> <br />\n'
  txt += '<span class="text">Workd</span> <leftOrRight /></div>'
  const tmp = xfold.renderText(txt)
  t.not(tmp, txt)
  t.is(tmp.indexOf('<div><span class="title">Hello</span> <br />'), 0)
})

test('single tag not found', async t => {
  const txt = `qwerty\n<mumu /> ...`
  const tmp = xfold.renderText(txt)
  t.is(txt, tmp)
})

test('double tag not found', async t => {
  const txt = `qwerty <mumu> </mumu> ...`
  const tmp = xfold.renderText(txt)
  t.is(txt, tmp)
})
