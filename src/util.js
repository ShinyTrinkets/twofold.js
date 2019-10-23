const fs = require('fs')
const path = require('path')

// Credit: https://stackoverflow.com/a/32604073/498361
function toCamelCase(str) {
    return (
        str
            // Replace any - or _ characters with a space
            .replace(/[-_]+/g, ' ')
            // Remove any non alphanumeric characters
            .replace(/[^\w\s]/g, '')
            // Remove space from the start and the end
            .trim()
            // Uppercase the first character in each group immediately following a space
            // (delimited by spaces)
            .replace(/ (.)/g, function($1) {
                return $1.toUpperCase()
            })
            // Remove all spaces
            .replace(/ /g, '')
    )
}

const isDoubleTag = t => !!(t && t.name && t.double)
const isSingleTag = t => !!(t && t.name && t.single && t.rawText)
const isRawText = t => t && t.name === undefined && t.single === undefined && t.double === undefined

const shouldConsume = t => t.params && t.params['consume'] === 'true'

function getText(node) {
    let text = ''
    if (!node.children) {
        if (isRawText(node)) {
            return node.rawText
        } else {
            return ''
        }
    }
    for (const c of node.children) {
        if (isDoubleTag(c)) {
            text += getText(c)
        } else {
            text += c.rawText
        }
    }
    return text
}

function unParse(node) {
    let text = ''
    if (node.children) {
        text = node.firstTagText
        for (const c of node.children) {
            if (isDoubleTag(c)) {
                text += unParse(c)
            } else {
                text += c.rawText
            }
        }
        text += node.secondTagText
    }
    // Empty double tag, single tag, or raw text
    else {
        if (isDoubleTag(node)) {
            text = node.firstTagText
            text += node.secondTagText
        } else {
            text = node.rawText
        }
    }
    return text
}

function requireFolder(dir) {
    let functions = {}
    const normalizedPath = path.join(process.cwd(), dir)
    // console.log('Require:', normalizedPath)
    fs.readdirSync(normalizedPath).forEach(function (fname) {
        const f = require(path.join(normalizedPath, fname))
        // side-effect: overwrite any duplicate functions
        functions = Object.assign(functions, f)
    })
    return functions
}

module.exports = {
    toCamelCase,
    isDoubleTag,
    isSingleTag,
    isRawText,
    shouldConsume,
    getText,
    unParse,
    requireFolder,
}
