#!/usr/bin/env node

const fs = require('fs')
const twofold = require('./')
const scan = require('./scan')
const util = require('./util')
const files = require('./files')
const p = require('../package')
const crypto = require('crypto')
const minimist = require('minimist')
const cmdOptions = require('minimist-options')
const cosmiConfig = require('cosmiconfig')
const chokidar = require('chokidar')

const options = cmdOptions({
    scan: {
        alias: 's',
        type: 'string',
    },
    watch: {
        alias: 'w',
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

Scan a file or folder to see what tags might be processed:

  $ 2fold --scan <file>

Watch or folder to render everytime the files are changed:

  $ 2fold --watch <file>

If you want to test some tags, or chain multiple
CLI apps together, you can use pipes:

  $ echo "yes or no: <replace-yes-or-no />" | 2fold
  $ cat my-file.md | 2fold
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

    // Load all functions from specified folder
    let funcs = {}
    if (args.funcs) {
        console.debug('(2✂︎f) Funcs:', args.funcs)
        funcs = util.requireFolder(args.funcs)
    }
    // Explore all possible config locations
    const explorer = cosmiConfig('twofold')
    let config = explorer.searchSync()
    if (config) {
        config = config.config
        console.debug('(2✂︎f) Config:', config)
    }

    if (args.scan) {
        const fname = args.scan
        let fstat
        try {
            fstat = fs.statSync(fname)
        } catch (err) {
            console.error(err)
            return
        }
        console.log('(2✂︎f) Scan:', fname)
        if (fstat.isFile()) {
            await scan.scanFile(fname, funcs, config)
        } else if (fstat.isDirectory()) {
            await scan.scanFolder(fname, funcs, config)
        } else {
            console.error('Unknown path type:', fstat)
        }
        return
    }

    if (args.watch) {
        const locks = {}
        const hashes = {}
        const callback = async fname => {
            // console.log(`File ${fname} is changed`)
            if (locks[fname]) {
                // disable writing lock
                locks[fname] = false
                return false
            }
            const result = await twofold.renderFile(fname, {}, funcs, config)
            const hash = crypto
                .createHash('sha256')
                .update(result)
                .digest('hex')
            // compare last hash and skip writing
            // if the file is not changed
            if (hashes[fname] === hash) {
                return false
            }
            console.log('(2✂︎f)', fname)
            fs.writeFileSync(fname, result, { encoding: 'utf8' })
            locks[fname] = true
            hashes[fname] = hash
        }

        const watcher = chokidar.watch(args.watch, {
            persistent: true,
            ignoreInitial: true,
            followSymlinks: true,
            // awaitWriteFinish: {
            //     stabilityThreshold: 2000,
            //     pollInterval: 250,
            // },
        })
        watcher.on('add', callback).on('change', callback)
        return
    }

    if (args._ && args._.length) {
        for (const fname of args._) {
            if (!fname) {
                continue
            }
            let fstat
            try {
                fstat = fs.statSync(fname)
            } catch (err) {
                console.error(err)
                continue
            }
            if (fstat.isFile()) {
                console.log('(2✂︎f)', fname)
                const result = await twofold.renderFile(fname, {}, funcs, config)
                fs.writeFileSync(fname, result, { encoding: 'utf8' })
            } else if (fstat.isDirectory()) {
                const allFiles = await files.listFiles(fname)
                for (let f of allFiles) {
                    f = `${fname}/${f}`
                    console.log('(2✂︎f)', f)
                    const result = await twofold.renderFile(f, {}, funcs, config)
                    fs.writeFileSync(f, result, { encoding: 'utf8' })
                }
            } else {
                console.error('Unknown path type:', fstat)
                continue
            }
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

        result = await twofold.renderStream(stdin, {}, funcs, config)
        console.log(result)
    }
})()
