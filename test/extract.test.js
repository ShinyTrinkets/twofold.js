import * as fs from 'node:fs'
import path from 'node:path'
import test from 'ava'

import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import Lexer from '../src/lexer.js'
import parse from '../src/parser.js'
import twofold from '../src/index.js'
import { isRawText, isSingleTag, isDoubleTag } from '../src/tags.js'
//
// Testing the extraction of the blocks
// A more serious testing is done in render tests
//
test('no blocks found', async t => {
    const o = new Lexer()
    const txt = fs.readFileSync(__dirname + '/fixtures/text0.md', { encoding: 'utf8' })
    const lex = o.lex(txt)
    t.is(lex.length, 1)
    const ast = parse(lex)
    t.is(ast.length, 1)
    t.true(isRawText(ast[0]))
})

test('some blocks found', async t => {
    const o = new Lexer()
    const txt = fs.readFileSync(__dirname + '/fixtures/text1.md', { encoding: 'utf8' })
    const lex = o.lex(txt)
    t.is(lex.length, 13)
    t.true(isRawText(lex[0]))

    const ast = parse(lex)
    t.is(ast.length, 6)

    t.true(isRawText(ast[0]))
    t.true(isDoubleTag(ast[1]) && ast[1].name === 'open1')
    t.true(isRawText(ast[2]))
    t.true(isSingleTag(ast[3]) && ast[3].name === 'replaceWeather')
    t.true(isRawText(ast[4]))
    t.true(isDoubleTag(ast[5]) && ast[5].name === 'replaceSort')
})

test('render file no tags', async t => {
    const fname = __dirname + '/fixtures/text0.md'
    const txt = fs.readFileSync(fname, { encoding: 'utf8' })
    const final = await twofold.renderFile(fname)
    t.is(txt, final)
})

test('render file some tags', async t => {
    const fname = __dirname + '/fixtures/text1.md'
    const txt = fs.readFileSync(fname, { encoding: 'utf8' })
    const final = await twofold.renderFile(fname)
    t.is(txt, final)
})

test('render folder', async t => {
    const folder = __dirname + '/fixtures/'
    let result = await twofold.renderFolder(folder)
    t.is(3, result)
    result = await twofold.renderFolder(folder, {}, {}, { glob: '*.js' })
    t.is(1, result)
})
