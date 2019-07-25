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
    ['<x/ >', [{ rawText: '<x/ >' }]],
    ['<x///', [{ rawText: '<x///' }]],
    ['<x 1 />', [{ rawText: '<x 1 />' }]],
    ['<A B />', [{ rawText: '<A B />' }]],
    ['<1tag />', [{ rawText: '<1tag />' }]],
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
    [
        'blah <tesTing>!!',
        [{ rawText: 'blah <tesTing>!!' }] // this is raw-text
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
        '<temp_f>0</temp_f>',
        [
            {
                name: 'temp_f',
                name2: 'temp_f',
                textInside: '0',
                rawText: '<temp_f>0</temp_f>',
                single: false,
            }
        ]
    ],
    [
        '<dayOrNight date="2019-07">...</dayOrNight>',
        [
            {
                name: 'dayOrNight',
                name2: 'dayOrNight',
                param: 'date="2019-07"',
                textInside: '...',
                rawText: '<dayOrNight date="2019-07">...</dayOrNight>',
                single: false,
            }
        ]
    ],
    [
        '< increment nr=5 ></ increment >',
        [
            {
                name: 'increment',
                name2: 'increment',
                param: 'nr=5',
                textInside: '',
                rawText: '< increment nr=5 ></ increment >',
                single: false,
            }
        ]
    ],
    [
        '<increment nr=1>></  increment  >',
        [
            {
                name: 'increment',
                name2: 'increment',
                param: 'nr=1',
                textInside: '>',
                rawText: '<increment nr=1>></  increment  >',
                single: false,
            }
        ]
    ],
    [
        ' <temp_f>0</temp_x>',
        [{ rawText: ' <temp_f>0</temp_x>' }]
    ],
    [
        ' < tag>0</ tag#>',
        [{ rawText: ' < tag>0</ tag#>' }]
    ],
    [
        ' < tag#>0</ tag#>',
        [{ rawText: ' < tag#>0</ tag#>' }]
    ],
    [
        '< tag>0</ t!',
        [{ rawText: '< tag>0</ t!' }]
    ],
    [
        '< tag>0</ tag',
        [{ rawText: '< tag>0</ tag' }]
    ],
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
