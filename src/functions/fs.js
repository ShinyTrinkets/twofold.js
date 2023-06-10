import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const fsOpen = promisify(fs.open)
const fsRead = promisify(fs.read)
const readDir = promisify(fs.readdir)

export async function cat(_, { file, start = 0, limit = 250 }) {
    file = path.normalize(file)
    const fd = await fsOpen(file, 'r')
    const buffer = Buffer.alloc(limit)
    await fsRead(fd, buffer, 0, limit, start)
    return buffer.toString()
}

export async function listDir(_, { dir, li = '*', space = ' ' }) {
    let result = ''
    dir = path.normalize(dir)
    const files = await readDir(dir)
    for (const f of files) {
        result += `${li}${space}${f}\n`
    }
    return result.trim()
}
