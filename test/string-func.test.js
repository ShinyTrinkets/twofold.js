import test from 'ava'
import func from '../src/functions'

test('sort lines', async t => {
  let txt

  txt = { text: '\n\nb\na\n' }
  t.is(func.sortLines(txt), '\n\na\nb\n')

  txt = { text: '\n\n\n\nb\na\n' }
  t.is(func.sortLines(txt), '\n\n\n\na\nb\n')

  txt = { text: '\nb\na\nB\nA\n' }
  t.is(func.sortLines(txt), '\na\nA\nb\nB\n')
})
