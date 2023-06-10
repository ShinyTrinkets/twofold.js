/*
 * Scan files and return info about them.
 */
import fs from 'fs'
import readdirp from 'readdirp'

import Lexer from './lexer.js'
import parse from './parser.js'
import functions from './functions/index.js'
import { isDoubleTag, isSingleTag } from './tags.js'

export async function scanFile(fname, customFunctions = {}, customConfig = {}) {
    const allFunctions = { ...functions, ...customFunctions }
    const nodes = []

    const walk = tag => {
        // Deep walk into tag and list all tags
        if (isDoubleTag(tag)) {
            nodes.push({ double: true, name: tag.name, tag: tag.firstTagText + tag.secondTagText })
        } else if (isSingleTag(tag)) {
            nodes.push({ single: true, name: tag.name, tag: tag.rawText })
        }
        if (tag.children) {
            for (const c of tag.children) {
                if (isDoubleTag(c)) {
                    walk(c)
                } else if (isSingleTag(c)) {
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
            console.log('-------')
        })
    })
}

export async function scanFolder(dir, customFunctions = {}, config = {}) {
    const label = 'scan-' + dir
    console.time(label)

    const glob = config.glob || ['*.*']
    const depth = config.depth || 3

    for await (const pth of readdirp(dir, { fileFilter: glob, depth })) {
        try {
            const fname = `${dir}/${pth.path}`
            await scanFile(fname, customFunctions, config)
        } catch (err) {
            console.error(err)
        }
    }
    console.timeEnd(label)
}
