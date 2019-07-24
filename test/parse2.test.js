import test from 'ava'
import tf from '../src/parse2'
//
// Parse version 2
//
// Tests: raw text and expected result after parsing
const TESTS = [
    ['?asd 123 qwerty!', [{ rawText: '?asd 123 qwerty!' }]],
    ['asd >>', [{ rawText: 'asd >>' }]],
    ['asd <<', [{ rawText: 'asd <<' }]],
    ['<x>', [{ rawText: '<x>' }]],
    ['< x>', [{ rawText: '< x>' }]],
    [
        '<x/>',
        [{ rawText: '<x/>', name: 'x', single: true }],
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
        '< x />',
        [{ rawText: '< x />', name: 'x', single: true }],
    ],
    [
        '<   x />',
        [{ rawText: '<   x />', name: 'x', single: true }],
    ],
    [
        '< x   />',
        [{ rawText: '< x   />', name: 'x', single: true }],
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
    ['blah <tesTing>!', [{ rawText: 'blah <tesTing>!' }]],
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
    ]
]

test('test all tests', t => {
    for (const [text, expected] of TESTS) {
        const p = new tf.Parser()
        for (const chunk of chunkText(text, 5)) {
            p.push(chunk)
        }
        const parsed = p.finish()
        // console.log('--- PARSED ::', parsed, '\n')

        let parsedTxt = ''
        for (const s of parsed) {
            parsedTxt += s.rawText
        }
        t.is(parsedTxt, text)
        t.deepEqual(expected, parsed)
    }
})

test('crash test', t => {
    const p = new tf.Parser()
    p.push('')
    const parsed = p.finish()
    t.deepEqual([], parsed)
    t.throws(() => {
        p.push('')
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
