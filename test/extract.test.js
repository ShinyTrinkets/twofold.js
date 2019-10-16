import fs from 'fs'
import test from 'ava'
import tf from '../src'
import lexer from '../src/lexer'
import parser from '../src/parser'
import { isRawText, isSingleTag, isDoubleTag } from '../src/util'
//
// Testing the extraction of the blocks
// A more serious testing is done in render tests
//
test('no blocks found', async t => {
  const o = new lexer.Lexer()
  const txt = fs.readFileSync(__dirname + '/fixtures/text0.md', { encoding: 'utf8' })
  o.push(txt)
  const lex = o.finish()
  t.is(lex.length, 1)
  const ast = parser.parse(lex)
  t.is(ast.length, 1)
  t.true(isRawText(ast[0]))
})

test('some blocks found', async t => {
  const o = new lexer.Lexer()
  const txt = fs.readFileSync(__dirname + '/fixtures/text1.md', { encoding: 'utf8' })
  o.push(txt)
  const lex = o.finish()
  t.is(lex.length, 13)
  t.true(isRawText(lex[0]))

  const ast = parser.parse(lex)
  t.is(ast.length, 6)

  t.true(isRawText(ast[0]))
  t.true(isDoubleTag(ast[1]) && ast[1].name === 'open1')
  t.true(isSingleTag(ast[3]) && ast[3].name === 'replaceWeather')
  t.true(isDoubleTag(ast[5]) && ast[5].name === 'replaceSort')
})

test('render file no tags', async t => {
  const fname = __dirname + '/fixtures/text0.md'
  const txt = fs.readFileSync(fname, { encoding: 'utf8' })
  const final = await tf.renderFile(fname)
  t.is(txt, final)
})

test('render file some tags', async t => {
  const fname = __dirname + '/fixtures/text1.md'
  const txt = fs.readFileSync(fname, { encoding: 'utf8' })
  const final = await tf.renderFile(fname)
  t.is(txt, final)
})
