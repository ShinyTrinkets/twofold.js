import test from 'ava'
import tf from '../src/lexer'
//
// TwoFold Lexer testing
//
// Tests: raw text and expected result after lexing
const TESTS = [
    ['?asd 123 qwerty!', [{ rawText: '?asd 123 qwerty!' }]],
    ['asd >>', [{ rawText: 'asd >>' }]],
    ['asd <<', [{ rawText: 'asd <<' }]],
    ['asd />', [{ rawText: 'asd />' }]],
    ['<x/', [{ rawText: '<x/' }]],
    ['<x /', [{ rawText: '<x /' }]],
    ['<x//', [{ rawText: '<x//' }]],
    ['<x 1 />', [{ rawText: '<x 1 />' }]],
    ['<A B />', [{ rawText: '<A B />' }]],
    ['<x/ >', [{ rawText: '<x/ >' }]],
    ['<1tag />', [{ rawText: '<1tag />' }]],

    ['<x1>',
        [{ rawText: '<x1>', name: 'x1', double: true }],
    ],
    ['< x>',
        [{ rawText: '< x>', name: 'x', double: true }],
    ],
    ['<x >',
        [{ rawText: '<x >', name: 'x', double: true }],
    ],
    ['<  xY  >',
        [{ rawText: '<  xY  >', name: 'xY', double: true }],
    ],
    [
        '<xY1/>',
        [{ rawText: '<xY1/>', name: 'xY1', single: true }],
    ],
    [
        '< x/>',
        [{ rawText: '< x/>', name: 'x', single: true }],
    ],
    [
        '<x />',
        [{ rawText: '<x />', name: 'x', single: true }],
    ],
    [
        '<x  />',
        [{ rawText: '<x  />', name: 'x', single: true }],
    ],
    [
        'q <X/> a',
        [{ rawText: 'q <X/> a' }] // this is raw-text
    ],
    [
        '<X/>',
        [{ rawText: '<X/>' }] // this is raw-text
    ],
    [
        '< X/>',
        [{ rawText: '< X/>' }] // this is raw-text
    ],
    [
        '<X />',
        [{ rawText: '<X />' }] // this is raw-text
    ],
    [
        '< X />',
        [{ rawText: '< X />' }] // this is raw-text
    ],
    [
        '<tag a/>',
        [{ rawText: '<tag a/>' }] // this is raw-text
    ],
    [
        '<tag a />',
        [{ rawText: '<tag a />' }] // this is raw-text
    ],
    [
        '<tag x=/>',
        [{ rawText: '<tag x=/>' }] // this is raw-text
    ],
    [
        '<tag x= />',
        [{ rawText: '<tag x= />' }] // this is raw-text
    ],
    [
        '< /tag >',
        [{ rawText: '< /tag >' }] // this is raw-text
    ],
    [
        '<tag/ >',
        [{ rawText: '<tag/ >' }] // this is raw-text
    ],
    [
        ' < tag#>',
        [{ rawText: ' < tag#>' }] // this is raw-text
    ],
    [
        ' </ tag#>',
        [{ rawText: ' </ tag#>' }] // this is raw-text
    ],
    [
        '0</ t!',
        [{ rawText: '0</ t!' }] // this is raw-text
    ],
    [
        '0</ tag',
        [{ rawText: '0</ tag' }] // this is raw-text
    ],
    [
        '<</ tag <<',
        [{ rawText: '<</ tag <<' }] // this is raw-text
    ],

    [
        'blah <tesTing>!!',
        [
            { rawText: 'blah ' },
            { rawText: '<tesTing>', name: 'tesTing', double: true },
            { rawText: '!!' },
        ]
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
        '. < tag/> blah blah',
        [
            { rawText: '. ' },
            {
                name: 'tag',
                rawText: '< tag/>',
                single: true,
            },
            { rawText: ' blah blah' }
        ]
    ],
    [
        '< temp_f />< temp_c />',
        [
            {
                name: 'temp_f',
                rawText: '< temp_f />',
                single: true,
            },
            {
                name: 'temp_c',
                rawText: '< temp_c />',
                single: true,
            }
        ]
    ],
    [
        '?<increment nr=99/>!',
        [
            { rawText: '?' },
            {
                name: 'increment',
                param: 'nr=99',
                rawText: '<increment nr=99/>',
                single: true,
            },
            { rawText: '!' }
        ]
    ],
    [
        '< dayOrNight date="2019-07" />',
        [
            {
                name: 'dayOrNight',
                param: 'date="2019-07"',
                rawText: '< dayOrNight date="2019-07" />',
                single: true,
            }
        ]
    ],
    [
        '<temp_f>0</temp_f>',
        [
            {
                name: 'temp_f',
                rawText: '<temp_f>',
                double: true,
            },
            { rawText: '0' },
            {
                name: 'temp_f',
                rawText: '</temp_f>',
                double: true,
            }
        ]
    ],
    [
        '<a_b></b_c> ', // non matching tags are lexed OK
        [
            {
                name: 'a_b',
                rawText: '<a_b>',
                double: true,
            },
            {
                name: 'b_c',
                rawText: '</b_c>',
                double: true,
            },
            { rawText: ' ' },
        ]
    ],
    [
        '<dayOrNight date="2019-07">...</dayOrNight>',
        [
            {
                name: 'dayOrNight',
                param: 'date="2019-07"',
                rawText: '<dayOrNight date="2019-07">',
                double: true,
            },
            { rawText: '...' },
            {
                name: 'dayOrNight',
                rawText: '</dayOrNight>',
                double: true,
            },
        ]
    ],
    [
        '< increment nr=5 ></ increment  >',
        [
            {
                name: 'increment',
                param: 'nr=5',
                rawText: '< increment nr=5 >',
                double: true,
            },
            {
                name: 'increment',
                rawText: '</ increment  >',
                double: true,
            }
        ]
    ],
    [
        '<increment nr=1>></  increment  >',
        [
            {
                name: 'increment',
                param: 'nr=1',
                rawText: '<increment nr=1>',
                double: true,
            },
            { rawText: '>' },
            {
                name: 'increment',
                rawText: '</  increment  >',
                double: true,
            }
        ]
    ],
]

test('all lex tests', t => {
    for (const [text, expected] of TESTS) {
        const o = new tf.Lexer()
        for (const chunk of chunkText(text, 5)) {
            o.push(chunk)
        }
        const lex = o.finish()
        // console.log('--- LEXED ::', lex, '\n')

        let lexTxt = ''
        for (const s of lex) {
            lexTxt += s.rawText
        }
        t.is(lexTxt, text)
        t.deepEqual(expected, lex)
    }
})

test('lexer crash', t => {
    const p = new tf.Lexer()
    p.push('')
    const lex = p.finish()
    t.deepEqual([{ rawText: '' }], lex)
    t.throws(() => {
        p.push('')
    }, Error)
    t.throws(() => {
        p.finish()
    }, Error)
})

function chunkText(txt, len) {
    let t = ''
    let c = []
    for (let x of txt) {
        t += x
        if (t.length === len) {
            c.push(t)
            t = ''
        }
    }
    if (t) {
        c.push(t)
    }
    return c
}
