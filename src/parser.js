const config = require('./config')

const RE_FIRST_START = new RegExp(`^${config.openTag[0]}[ ]*[a-z]`)
const RE_SECOND_START = new RegExp(`^${config.openTag[0]}${config.lastStopper[0]}[ ]*[a-z]`)

function parse(tokens) {
    // Transform an unstructured stream of tokens (coming from the lexer)
    // into a tree-like structure.
    const ast = []
    const stack = []
    const topStack = () => stack[stack.length - 1]
    const isRawText = t => t.name === undefined && t.single === undefined && t.double === undefined

    for (const token of tokens) {
        if (!token.rawText) {
            continue
        }
        // console.log('TOKEN ::', token)

        if (token.name && token.double) {
            // Is this the start of a double tag?
            if (RE_FIRST_START.test(token.rawText)) {
                token.textInside = ''
                stack.push(token)
                continue
            }
            // Is this the end of a double tag?
            else if (RE_SECOND_START.test(token.rawText)) {
                if (topStack().name === token.name) {
                    const firstTag = stack.pop()
                    ast.push(firstTag)
                    continue
                }
            }
        }
        // Is this raw text?
        else if (isRawText(token)) {
            const firstTag = topStack()
            if (firstTag) {
                // console.log('ADD TEXT INSIDE ::', firstTag)
                firstTag.textInside += token.rawText
                continue
            }
        }

        ast.push(token)
    }

    // Empty the stack
    for (const token of stack) {
        ast.push({ rawText: token.rawText })
    }

    return ast
}

module.exports = { parse }
