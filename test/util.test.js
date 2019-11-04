import test from 'ava'
import { toCamelCase } from '../src/util'

test('camel case 1', async t => {
    let text = 'blah blah'
    const expected = 'blahBlah'
    t.is(expected, toCamelCase(text))

    text = 'blah-blah'
    t.is(expected, toCamelCase(text))

    text = 'blah_blah'
    t.is(expected, toCamelCase(text))
})
