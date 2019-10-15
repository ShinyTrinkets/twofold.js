/*
 * Scan files and return info about them.
 */
const fs = require('fs')
const util = require('./util')
const { Lexer } = require('./lexer')
const { parse } = require('./parser')

async function scanFile(fname) {
    let nodes = 0
    const walk = tag => {
        // Deep walk into tag and list all tags
        if (util.isDoubleTag(tag)) {
            nodes += 1
            console.log('Double tag:', tag.firstTagText, tag.secondTagText)
        } else if (util.isSingleTag(tag)) {
            nodes += 1
            console.log('Single tag:', tag.rawText)
        }
        if (tag.children) {
            for (const c of tag.children) {
                if (util.isDoubleTag(c)) {
                    walk(c)
                } else if (util.isSingleTag(c)) {
                    nodes += 1
                    console.log('Single tag:', c.rawText)
                }
            }
        }
    }

    return new Promise(resolve => {
        const label = 'scan-' + fname
        console.time(label)

        let len = 0
        const p = new Lexer()
        const stream = fs.createReadStream(fname, { encoding: 'utf8' })

        stream.on('data', data => {
            len += data.length
            p.push(data)
        })
        stream.on('close', () => {
            const ast = parse(p.finish())
            console.log('Text length ::', len)
            for (const tag of ast) {
                walk(tag)
            }
            console.log('Nr of tags ::', nodes)
            console.timeEnd(label)
            resolve()
        })
    })
}

async function scanFolder(dir) {
    const label = 'scan-' + dir
    console.time(label)
    for (const fname of fs.readdirSync(dir)) {
        await scanFile(dir + '/' + fname)
    }
    console.timeEnd(label)
}

module.exports = { scanFile, scanFolder }
