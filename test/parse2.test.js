import test from 'ava'
import tf from '../src/parse2'
//
// Parse version 2
//
// Tests: raw text and expected result after parsing
const TESTS = [
    [
        '?asd 123 qwerty!',
        [{ rawText: '?asd 123 qwerty!' }]
    ],
    [
        'asd >>',
        [{ rawText: 'asd >>' }]
    ],
    [
        'asd <<',
        [{ rawText: 'asd <<' }]
    ],
    [
        '<x>',
        [{ rawText: '<x>', name: 'x' }]
    ],
    [
        '< x>',
        [{ rawText: '< x>', name: 'x' }]
    ],
    [
        'q <X> a',
        [{ rawText: 'q <X> a' }]
    ],
    [
        '<X>',
        [{ rawText: '<X>' }]
    ],
    [
        'asd <tesTing> zxc',
        [
            { rawText: 'asd ' },
            {
                rawText: '<tesTing>',
                name: 'tesTing'
            },
            { rawText: ' zxc' }
        ]
    ],
    [
        '. < tag> blah blah',
        [
            { rawText: '. ' },
            {
                rawText: '< tag>',
                name: 'tag'
            },
            { rawText: ' blah blah' }
        ]
    ]
]

test('test all tests', t => {
    for (const [text, expected] of TESTS) {
        const p = new tf.Parser()
        for (const chunk of chunkText(text, 5)) {
            p.push(chunk)
        }
        const parsed = p.finish()
        console.log('--- PARSED ::', parsed)

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
    let t = '', c = []
    for (let x of txt) {
        t += x
        if (t.length === len) {
            c.push(t)
            t = ''
        }
    }
    if (t) { c.push(t) }
    return c
}
