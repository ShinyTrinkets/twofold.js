import test from 'ava'
import Lexer from '../src/lexer.js'
import parse from '../src/parser.js'
import { getText, unParse } from '../src/tags.js'

test('raw text getText', async t => {
    const txt = ' blah blah...'
    const ast = parse(new Lexer().lex(txt))
    const final = getText(ast[0])
    t.is(final, txt)
})

test('single tag getText', async t => {
    const txt = '<stuff />'
    const ast = parse(new Lexer().lex(txt))
    const final = getText(ast[0])
    t.is(final, '')
})

test('raw text parse unparse', async t => {
    const txt = ' blah blah...'
    const ast = parse(new Lexer().lex(txt))
    const final = unParse(ast[0])
    t.is(final, txt)
})

test('single tag parse unparse', async t => {
    const txt = '<stuff />'
    const ast = parse(new Lexer().lex(txt))
    const final = unParse(ast[0])
    t.is(final, txt)
})

test('double tag parse unparse 1', async t => {
    const txt = '<stuff></stuff>'
    const ast = parse(new Lexer().lex(txt))
    const final = unParse(ast[0])
    t.is(final, txt)
})

test('double tag parse unparse 2', async t => {
    const txt = '<stuff>???</stuff>'
    const ast = parse(new Lexer().lex(txt))
    const final = unParse(ast[0])
    t.is(final, txt)
})

test('parse unparse 1', async t => {
    const txt = '<mumu a=b><mumu><mumu><increment>0</increment>\n</mumu></mumu></mumu>'
    const ast = parse(new Lexer().lex(txt))
    const final = unParse(ast[0])
    t.is(final, txt)
})

test('parse unparse 2', async t => {
    let txt = ''
    txt += '<div><span class="title">Hello</span> <br />\n'
    txt += '<span class="text">Workd</span> <br />\n</div>'
    const ast = parse(new Lexer().lex(txt))
    const final = unParse(ast[0])
    t.is(final, txt)
})
