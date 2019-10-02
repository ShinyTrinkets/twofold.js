import fs from 'fs'
import test from 'ava'
import lexer from '../src/lexer'
import parser from '../src/parser'
//
// Testing the extraction of the blocks
// A more serious testing is done in render tests
//
const isRawText = t => t && t.name === undefined && t.single === undefined && t.double === undefined
const isDoubleTag = t => t && t.name && t.double
const isSingleTag = t => t && t.name && t.single
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
  t.true(isDoubleTag(ast[1]))
  t.true(isSingleTag(ast[3]))
  t.true(isRawText(ast[4]))
  t.true(isDoubleTag(ast[5]))
})
