const fs = require('fs')
const mm = require('micromatch')
const { promisify } = require('util')
const readDir = promisify(fs.readdir)

async function listFiles(folder, pattern = '*.*') {
    const allFiles = (await readDir(folder)) || []
    if (pattern) {
        return allFiles.filter(f => mm.isMatch(f, pattern))
    }
    return allFiles
}

module.exports = { listFiles }
