const config = require('./config')

const RE_FIRST_START = new RegExp(`^${config.openTag[0]}[ ]*[a-z]`)
const RE_SECOND_START = new RegExp(`^${config.openTag[0]}${config.lastStopper[0]}[ ]*[a-z]`)

const isRawText = t => t && t.name === undefined && t.single === undefined && t.double === undefined
const isDoubleTag = t => t && t.name && t.double

function addChild(t, c) {
    if (!t.children) {
        t.children = []
    }
    t.children.push(c)
}

/**
 * Transform an unstructured stream of tokens (coming from the lexer)
 * into a tree-like structure.
 * If the tag is double, it will have children of type raw text,
 * or other single or double tags.
 */
function parse(tokens) {
    const ast = []
    const stack = []
    const getTopAst = () => ast[ast.length - 1]
    const getTopStack = () => stack[stack.length - 1]

    for (const token of tokens) {
        if (!token.rawText) {
            continue
        }
        // console.log('TOKEN ::', token)

        const topAst = getTopAst()
        const topTag = getTopStack()

        if (isRawText(token) && isRawText(topTag)) {
            // console.log('Raw text + Raw text ::', token)
            topTag.rawText += token.rawText
            continue
        }

        if (isDoubleTag(token)) {
            // Is this the start of a double tag?
            if (RE_FIRST_START.test(token.rawText)) {
                // console.log(`Start double Tag ${token.name} !`)
                token.firstTagText = token.rawText
                stack.push(token)
                continue
            }
            // Is this the end of a double tag?
            else if (RE_SECOND_START.test(token.rawText)) {
                let currentTag
                if (topTag.name === token.name) {
                    // console.log(`End double Tag ${token.name} !`)
                    topTag.secondTagText = token.rawText
                    delete topTag.rawText
                    currentTag = stack.pop()
                } else {
                    // console.log(`Non matching double Tag ${topTag.name} != ${token.name}`)
                    topTag.rawText += token.rawText
                    currentTag = { rawText: topTag.rawText }
                    stack.pop()
                }
                const deepTag = getTopStack()
                if (isDoubleTag(deepTag)) {
                    addChild(deepTag, currentTag)
                } else {
                    ast.push(currentTag)
                }
                continue
            }
        }

        if (isDoubleTag(topTag)) {
            // console.log(`Add child to double tag ${topTag.name} ::`, token)
            addChild(topTag, token)
        } else {
            if (isRawText(token) && isRawText(topAst)) {
                topAst.rawText += token.rawText
            } else {
                ast.push(token)
            }
        }
    }

    // Empty the stack
    for (const token of stack) {
        // console.log('STACK ::', token)
        if (isDoubleTag(token) && token.children) {
            for (const child of token.children) {
                token.rawText += child.rawText
            }
        }
        const topAst = getTopAst()
        if (isRawText(topAst)) {
            topAst.rawText += token.rawText
        } else {
            ast.push({ rawText: token.rawText })
        }
    }

    return ast
}

module.exports = { parse }
