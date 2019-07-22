import test from 'ava'
import tf from '../src/parse2'
//
// Parse version 2
//
test('test1', async t => {
    const txt = '?asd 123 qwerty!'
    const expected = [{ rawText: '?asd 123 qwerty!' }]

    const p = new tf.Parser()
    p.push(txt)
    const parsed = p.finish()
    t.deepEqual(expected, parsed)
})

test('test2', async t => {
    const txt = 'asd <'
    const expected = [{ rawText: 'asd <' }]

    const p = new tf.Parser()
    p.push(txt)
    const parsed = p.finish()
    t.deepEqual(expected, parsed)
})

test('test3', async t => {
    const txt = 'asd <tesTing> zxc'
    const expected = [
        { rawText: 'asd ' },
        {
            rawText: '<tesTing>',
            name: 'tesTing'
        },
        { rawText: ' zxc' }
    ]

    const p = new tf.Parser()
    p.push(txt)
    const parsed = p.finish()
    t.deepEqual(expected, parsed)
})
