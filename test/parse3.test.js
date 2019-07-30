import test from 'ava'
import tf from '../src/parse3'
//
// Parse version 3
//
// Tests: raw text and expected result after lexing
const TESTS = [
    ['?asd 123 qwerty!', [{ rawText: '?asd 123 qwerty!' }]],
    ['asd >>', [{ rawText: 'asd >>' }]],
    ['asd <<', [{ rawText: 'asd <<' }]],
    ['<x///', [{ rawText: '<x///' }]],
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
]

test('test all tests', t => {
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

test('crash test', t => {
    const p = new tf.Lexer()
    p.push('')
    const lex = p.finish()
    t.deepEqual([], lex)
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
