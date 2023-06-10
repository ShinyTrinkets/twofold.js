import test from 'ava'
import { toCamelCase, importAny } from '../src/util.js'

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
    const importedFile = await importAny('./test/fixtures/funcs.js')
    const expected = ['magic', 'now']
    t.deepEqual(expected, Object.keys(importedFile))
    t.is(importedFile.magic(), 'magic')
})
