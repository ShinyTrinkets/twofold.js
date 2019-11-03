const fs = require('fs')
const path = require('path')
const { isRawText, isDoubleTag } = require('./tags')

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
    fs.readdirSync(normalizedPath).forEach(function(fname) {
        try {
            // side-effect: overwrite any duplicate functions
            const f = require(path.join(normalizedPath, fname))
            functions = Object.assign(functions, f)
        } catch (err) {
            console.error(err)
        }
    })
    return functions
}

module.exports = {
    toCamelCase,
    getText,
    unParse,
    requireFolder,
}
