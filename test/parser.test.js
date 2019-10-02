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
        '<temp type=f>0</',
        [{ rawText: '<temp type=f>0</' }] // this is raw-text
    ],
    [
        'blah <tesTing>!!',
        [{ rawText: 'blah <tesTing>!!' }] // this is raw-text
    ],
    [
        '<a_b></b_c> ',
        [{ rawText: '<a_b></b_c> ' }] // this is raw-text
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
        '<asd> <tesTing/> </zxc>',
        [
            { rawText: '<asd> ' },
            {
                name: 'tesTing',
                rawText: '<tesTing/>',
                single: true,
            },
            { rawText: ' </zxc>' }
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
        '<t1><t2><t3><xXx/>?</t3></t2></t1>',
        [
            {
                double: true,
                firstTagText: '<t1>',
                secondTagText: '</t1>',
                name: 't1',
                children: [
                    {
                        double: true,
                        firstTagText: '<t2>',
                        secondTagText: '</t2>',
                        name: 't2',
                        children: [
                            {
                                double: true,
                                firstTagText: '<t3>',
                                secondTagText: '</t3>',
                                name: 't3',
                                children: [
                                    {
                                        name: 'xXx',
                                        rawText: '<xXx/>',
                                        single: true,
                                    },
                                    { rawText: '?' },
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    ],
    [
        '<t1><t2></t3></t1>',
        [
            {
                double: true,
                firstTagText: '<t1>',
                secondTagText: '</t1>',
                name: 't1',
                children: [
                    { rawText: '<t2></t3>' },
                ]
            }
        ]
    ],
    [
        '<t1><t2> </t2></tx>',
        [
            { rawText: '<t1>' },
            {
                double: true,
                firstTagText: '<t2>',
                secondTagText: '</t2>',
                name: 't2',
                children: [
                    { rawText: ' ' },
                ]
            },
            { rawText: '</tx>' },
        ]
    ],
]

test('all parse tests', t => {
    for (const [text, expected] of TESTS) {
        const o = new lexer.Lexer()
        o.push(text)
        const lex = o.finish()
        // console.log('-T- LEXED ::', JSON.stringify(lex, null, ' '), '\n')
        const ast = parser.parse(lex)
        // console.log('-T- PARSED ::', JSON.stringify(ast, null, ' '), '\n')
        t.deepEqual(expected, ast)
    }
})
