#!/usr/bin/env node

const fs = require('fs')
const xfold = require('./')
const p = require('../package')
const minimist = require('minimist')
const cmdOptions = require('minimist-options')

const options = cmdOptions({
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

You can also pipe a stream and see the result on
the screen:

  $ echo "yes or no: <replace-yes-or-no />" | 2fold
  $ cat my-file.md | 2fold

If you want to test some tags, or chain multiple
CLI apps together, just use the stdin.
`

function main() {
    const args = minimist(process.argv.slice(2), options)

    if (args.version) {
        console.log('TwoFold (2✂︎f) v' + p.version)
        return
    }

    if (args.help) {
        console.log(usage)
        return
    }

    if (args._ && args._.length) {
        for (const fname of args._) {
            if (!fname) {
                continue
            }
            console.log('(2✂︎f)', fname)
            const text = fs.readFileSync(fname, { encoding: 'utf8' })
            if (!text) {
                continue
            }
            const result = xfold.renderText(text)
            fs.writeFileSync(fname, result, { encoding: 'utf8' })
        }
    } else {
        const stdin = process.stdin
        stdin.setEncoding('utf8')

        let textChunks = ''
        stdin.on('data', function(chunk) {
            textChunks += chunk
        })
        stdin.on('end', function() {
            const result = xfold.renderText(textChunks)
            console.log(result)
        })
        setTimeout(function() {
            if (!textChunks && !textChunks.trim()) {
                console.log('(2✂︎f) Nothing to to')
                process.exit()
            }
        }, 25)
    }
}

main()
