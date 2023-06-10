import test from 'ava'
import * as func from '../src/functions/shell.js'

test('shell cmd', async t => {
    let txt = await func.cmd(null, {cmd: 'echo', args: 'test1 test2'})
    t.is(txt, 'test1 test2')
})
