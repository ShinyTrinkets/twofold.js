import test from 'ava'
import func from '../src/functions'

test('sort lines', async t => {
  let txt
  txt = { textInside: '\n\nb\na\n' }
  t.true(func.sortLines(txt) === '\n\na\nb\n')

  txt = { textInside: '\n\n\n\nb\na\n' }
  t.true(func.sortLines(txt) === '\n\n\n\na\nb\n')

  txt = { textInside: '\nb\na\nB\nA\n' }
  t.true(func.sortLines(txt) === '\n\na\nA\nb\nB')
})
