/*
 * Scan files and return info about them.
 */
const fs = require('fs')
const util = require('./util')
const { Lexer } = require('./lexer')
const { parse } = require('./parser')
const functions = require('./functions')

async function scanFile(fname, customFunctions = {}, customConfig = {}) {
    if (!fs.existsSync(fname)) {
        console.error(`\nInvalid file: "${fname}" !`)
        return
    }

    const allFunctions = Object.assign({}, functions, customFunctions)
    const nodes = []

    const walk = tag => {
        // Deep walk into tag and list all tags
        if (util.isDoubleTag(tag)) {
            nodes.push({ double: true, name: tag.name, tag: tag.firstTagText + tag.secondTagText })
        } else if (util.isSingleTag(tag)) {
            nodes.push({ single: true, name: tag.name, tag: tag.rawText })
        }
        if (tag.children) {
            for (const c of tag.children) {
                if (util.isDoubleTag(c)) {
                    walk(c)
                } else if (util.isSingleTag(c)) {
                    nodes.push({ single: true, name: tag.name, tag: tag.rawText })
                }
            }
        }
    }

    return new Promise(resolve => {
        const label = 'scan-' + fname
        console.time(label)

        let len = 0
        const p = new Lexer(customConfig)
        const stream = fs.createReadStream(fname, { encoding: 'utf8' })

        stream.on('data', data => {
            len += data.length
            p.push(data)
        })
        stream.on('close', () => {
            const ast = parse(p.finish(), customConfig)
            console.log('Text length ::', len)
            for (const tag of ast) {
                walk(tag)
            }
            console.timeEnd(label)
            console.log('Number of tags ::', nodes.length)
            for (const tag of nodes) {
                console.log(allFunctions[tag.name] ? '✓' : '✗', tag)
            }
            resolve()
        })
    })
}

async function scanFolder(dir) {
    if (!fs.existsSync(dir)) {
        console.error(`\nInvalid folder: "${fname}" !`)
        return
    }
    const label = 'scan-' + dir
    console.time(label)
    for (const fname of fs.readdirSync(dir)) {
        await scanFile(dir + '/' + fname)
    }
    console.timeEnd(label)
}

module.exports = { scanFile, scanFolder }