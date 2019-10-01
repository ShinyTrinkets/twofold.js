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
        'asd <tesTing/> zxc',
        [
            { rawText: 'asd ' },
            {
                name: 'tesTing',
                rawText: '<tesTing/>',
                single: true,
            },
            { rawText: ' zxc' }
        ]
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
        '<stuff><other /></stuff>',
        [
            {
                double: true,
                firstTagText: '<stuff>',
                secondTagText: '</stuff>',
                name: 'stuff',
                children: [
                    {
                        name: 'other',
                        rawText: '<other />',
                        single: true,
                    }
                ]
            }
        ]
    ],
    [
        '<aA> <bB /> </aA>',
        [
            {
                double: true,
                firstTagText: '<aA>',
                secondTagText: '</aA>',
                name: 'aA',
                children: [
                    { rawText: ' ' },
                    {
                        name: 'bB',
                        rawText: '<bB />',
                        single: true,
                    },
                    { rawText: ' ' },
                ]
            }
        ]
    ],

    [
        '<temp type=f>0</',
        [{ rawText: '<temp type=f>0</' }]
    ],
    [
        'blah <tesTing>!!',
        [
            { rawText: 'blah ' },
            { rawText: '<tesTing>!!' }, // separated raw texts are a problem
        ]
    ],
    [
        '<a_b></b_c> ', // non matching tags are raw text
        [
            { rawText: '<a_b></b_c>' },
            { rawText: ' ' }, // separated raw texts are a problem
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
