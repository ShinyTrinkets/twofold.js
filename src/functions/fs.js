const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const readDir = promisify(fs.readdir)

async function cat(_, { file, start = 0, limit = 250 }) {
    file = path.normalize(file)
    const result = await readFile(file)
    return result.slice(start, limit)
}

async function listDir(_, { dir, li = '*', space = ' ' }) {
    let result = ''
    dir = path.normalize(dir)
    const files = await readDir(dir)
    for (const f of files) {
        result += `${li}${space}${f}\n`
    }
    return result.trim()
}

module.exports = {
    cat,
    listDir,
}
