/*
 * Scan files and return info about them.
 */
const fs = require('fs')
const { Lexer } = require('./lexer')
const { parse } = require('./parser')

async function scanFile(fname) {
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
            console.log('AST length ::', ast.length)
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
