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
    const topStack = () => stack[stack.length - 1]

    for (const token of tokens) {
        if (!token.rawText) {
            continue
        }
        // console.log('TOKEN ::', token)

        const topTag = topStack()

        if (token.name && token.double) {
            // Is this the start of a double tag?
            if (RE_FIRST_START.test(token.rawText)) {
                // console.log('START DOUBLE TAG ::', token)
                token.firstTagText = token.rawText
                stack.push(token)
                continue
            }
            // Is this the end of a double tag?
            else if (RE_SECOND_START.test(token.rawText)) {
                // console.log('END DOUBLE TAG ::', token)
                if (topTag.name === token.name) {
                    topTag.secondTagText = token.rawText
                    delete topTag.rawText
                    ast.push(stack.pop())
                    continue
                } else {
                    // Non matching double tag
                    topTag.rawText += token.rawText
                    ast.push({ rawText: topTag.rawText })
                    stack.pop()
                    continue
                }
            }
        }

        if (isRawText(token) && isRawText(topTag)) {
            // console.log('Raw text + Raw text ::', token)
            topTag.rawText += token.rawText
            continue
        } else if (isDoubleTag(topTag)) {
            // console.log('Add child to double tag ::', token)
            addChild(topTag, token)
            continue
        }

        // console.log('Add tag as is ::', token)
        ast.push(token)
    }

    // Empty the stack
    for (const token of stack) {
        ast.push({ rawText: token.rawText })
        if (token.children) {
            for (const child of token.children) {
                const topAst = ast[ast.length - 1]
                if (isRawText(topAst)) {
                    topAst.rawText += child.rawText
                } else {
                    ast.push({ rawText: child.rawText })
                }
            }
        }
    }

    return ast
}

module.exports = { parse }
