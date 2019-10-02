const config = require('./config')

const RE_FIRST_START = new RegExp(`^${config.openTag[0]}[ ]*[a-z]`)
const RE_SECOND_START = new RegExp(`^${config.openTag[0]}${config.lastStopper[0]}[ ]*[a-z]`)

const isRawText = t => t && t.name === undefined && t.single === undefined && t.double === undefined
const isDoubleTag = t => t && t.name && t.double

function addChild(parent, c) {
    if (!parent.children) {
        parent.children = []
    }
    const topChild = parent.children[parent.children.length - 1]
    if (isRawText(topChild) && isRawText(c)) {
        topChild.rawText += c.rawText
    } else {
        parent.children.push(c)
    }
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

    const commitToken = function(token) {
        const topAst = getTopAst()
        const topStack = getTopStack()
        const parent = topStack || topAst
        if (isDoubleTag(topStack)) {
            addChild(topStack, token)
        } else if (isRawText(parent) && isRawText(token)) {
            // console.log('Raw text', token, '+ Stack Raw text', parent)
            parent.rawText += token.rawText
        } else {
            ast.push(token)
        }
    }

    for (const token of tokens) {
        if (!token.rawText) {
            continue
        }
        // console.log('TOKEN ::', token)

        const topTag = getTopStack()

        if (isDoubleTag(token)) {
            // Is this the start of a double tag?
            if (RE_FIRST_START.test(token.rawText)) {
                // console.log(`Start double Tag ${token.name} !`)
                token.firstTagText = token.rawText
                // Pushing this tag on the stack means that
                // all the following tags become children of this tag,
                // until it is closed, or invalid
                stack.push(token)
                continue
            }
            // Is this the end of a double tag?
            else if (RE_SECOND_START.test(token.rawText)) {
                if (topTag.name === token.name) {
                    // console.log(`End double Tag "${token.name}"`)
                    topTag.secondTagText = token.rawText
                    delete topTag.rawText
                    // Remove the tag from the stack and commit
                    commitToken(stack.pop())
                } else {
                    // console.log(`Non matching double Tag "${topTag.name}" != "${token.name}"`)
                    // Remove the tag from the stack and prepare to cleanup
                    stack.pop()
                    commitToken({ rawText: topTag.firstTagText || topTag.rawText })
                    if (topTag.children) {
                        for (const child of topTag.children) {
                            commitToken(child)
                        }
                    }
                    commitToken({ rawText: token.rawText })
                }
                continue
            }
        }

        if (isRawText(token) && isRawText(topTag)) {
            // console.log('Raw text', token, '+ Stack Raw text', topTag)
            topTag.rawText += token.rawText
            continue
        }

        // Commit
        commitToken(token)
    }

    // Empty the stack
    for (const token of stack) {
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
