import test from 'ava'
import { toCamelCase, importAny } from '../src/util'

test('camel case', async t => {
    let text = 'blah blah'
    const expected = 'blahBlah'
    t.is(expected, toCamelCase(text))

    text = 'blah-blah'
    t.is(expected, toCamelCase(text))

    text = 'blah_blah'
    t.is(expected, toCamelCase(text))
})

test('import any', async t => {
    const importedFile = importAny('./test/fixtures/funcs')
    const importedFolder = importAny('./test/fixtures')
    const expected = ['magic', 'now']

    t.deepEqual(expected, Object.keys(importedFile))
    t.deepEqual(expected, Object.keys(importedFolder))
})
