#!/usr/bin/env node

const fs = require('fs')
const xfold = require('./')
const scan = require('./scan')
const util = require('./util')
const p = require('../package')
const minimist = require('minimist')
const cmdOptions = require('minimist-options')

const options = cmdOptions({
    scan: {
        alias: 's',
        type: 'string',
    },
    funcs: {
        alias: 'f',
        type: 'string',
    },
    help: {
        alias: 'h',
        type: 'boolean',
        default: false,
    },
    version: {
        alias: 'v',
        type: 'boolean',
        default: false,
    },
    // Special option for positional arguments (`_` in minimist)
    arguments: 'string',
})

const usage = `TwoFold (2✂︎f) v${p.version}

Process a file that contains TwoFold template tags
and overwrite the original file:

  $ 2fold <file>

Scan a file to see what tags might be processed:

  $ 2fold --scan <file>

You can also pipe a stream and see the result on
the screen:

  $ echo "yes or no: <replace-yes-or-no />" | 2fold
  $ cat my-file.md | 2fold

If you want to test some tags, or chain multiple
CLI apps together, just use the stdin.
`

;(async function main() {
    const args = minimist(process.argv.slice(2), options)

    if (args.version) {
        console.log('TwoFold (2✂︎f) v' + p.version)
        return
    }

    if (args.help) {
        console.log(usage)
        return
    }

    if (args.scan) {
        const fname = args.scan
        console.log('(2✂︎f) Scan:', fname)
        await scan.scanFile(fname)
        return
    }

    // Load all functions from specified folder
    let funcs = {}
    if (args.funcs) {
        funcs = util.requireFolder(args.funcs)
    }

    if (args._ && args._.length) {
        for (const fname of args._) {
            if (!fname) {
                continue
            }
            console.log('(2✂︎f)', fname)
            const result = await xfold.renderFile(fname, {}, funcs)
            fs.writeFileSync(fname, result, { encoding: 'utf8' })
        }
    } else {
        const stdin = process.stdin
        stdin.setEncoding('utf8')
        let result = ''

        // This is probably not a good idea, hmm
        setTimeout(function() {
            if (!result && !result.trim()) {
                console.error('(2✂︎f) Nothing to to')
                process.exit()
            }
        }, 50)

        result = await xfold.renderStream(stdin, {}, funcs)
        console.log(result)
    }
})()
