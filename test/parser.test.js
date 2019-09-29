import test from 'ava'
import lexer from '../src/lexer'
import parser from '../src/parser'
//
// TwoFold Parse testing
//
// Tests: raw text and expected result after parsing
const TESTS = [
    ['?asd 123 qwe!', [{ rawText: '?asd 123 qwe!' }]],
    [
        '<tag x= />',
        [{ rawText: '<tag x= />' }] // this is raw-text
    ],
    ['<x1>',
        [{ rawText: '<x1>' }] // this is raw-text
    ],

    [
        '<temp type=f>0</temp>',
        [
            {
                double: true,
                firstTagText: '<temp type=f>',
                secondTagText: '</temp>',
                name: 'temp',
                param: 'type=f',
                children: [
                    { rawText: '0' }
                ]
            }
        ]
    ],

    [
        '<temp type=f>0</',
        [
            { rawText: '<temp type=f>' },
            { rawText: '0</' },
        ]
    ],
]

test('all parse tests', t => {
    for (const [text, expected] of TESTS) {
        const o = new lexer.Lexer()
        o.push(text)
        const lex = o.finish()
        // console.log('-T- LEXED ::', lex, '\n')
        const ast = parser.parse(lex)
        // console.log('-T- PARSED ::', ast, '\n')
        t.deepEqual(expected, ast)
    }
})
