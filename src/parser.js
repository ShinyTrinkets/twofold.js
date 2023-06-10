import * as config from './config.js'

import { isRawText, isSingleTag, isDoubleTag } from './tags.js'

const isFullDoubleTag = t => isDoubleTag(t) && t.firstTagText && t.secondTagText

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
export default function parse(tokens, customConfig = {}) {
    const { openTag, lastStopper } = Object.assign({}, config, customConfig)
    const RE_FIRST_START = new RegExp(`^${openTag[0]}[ ]*[a-z]`)
    const RE_SECOND_START = new RegExp(`^${openTag[0]}[${lastStopper[0]}][ ]*[a-z]`)

    const ast = []
    const stack = []
    const getTopAst = () => ast[ast.length - 1]
    const getTopStack = () => stack[stack.length - 1]

    const commitToken = function (token) {
        const topAst = getTopAst()
        const topStack = getTopStack()
        const parent = topStack || topAst
        if (isDoubleTag(topStack)) {
            addChild(topStack, token)
        } else if (isRawText(parent) && isRawText(token)) {
            parent.rawText += token.rawText
        } else {
            ast.push(token)
        }
    }

    for (const token of tokens) {
        if (!token || !token.rawText) {
            continue
        }
        // console.log('TOKEN ::', token)

        const topTag = getTopStack()

        if (isDoubleTag(token)) {
            // Is this the start of a double tag?
            if (RE_FIRST_START.test(token.rawText)) {
                // console.log(`Start double Tag "${token.name}" !`)
                token.firstTagText = token.rawText
                // Pushing this tag on the stack means that
                // all the following tags become children of this tag,
                // until it is closed, or invalid
                stack.push(token)
                continue
            }
            // Is this the end of a double tag?
            else if (RE_SECOND_START.test(token.rawText)) {
                if (topTag && topTag.name === token.name) {
                    // console.log(`End double Tag "${token.name}"`)
                    topTag.secondTagText = token.rawText
                    delete topTag.rawText
                    // Remove the tag from the stack and commit
                    commitToken(stack.pop())
                } else {
                    // console.log(`Non matching double Tag "${topTag.name}" != "${token.name}"`)
                    // Remove the tag from the stack and prepare to cleanup
                    stack.pop()
                    if (topTag && topTag.rawText) {
                        commitToken({ rawText: topTag.firstTagText || topTag.rawText })
                        if (topTag.children) {
                            for (const child of topTag.children) {
                                commitToken(child)
                            }
                        }
                    }
                    commitToken({ rawText: token.rawText })
                }
                continue
            }
        }

        // Commit
        commitToken(token)
    }

    const finalCommit = function (token) {
        const topAst = getTopAst()
        if (isRawText(topAst) && isRawText(token)) {
            topAst.rawText += token.rawText
        } else if (isSingleTag(token) || isFullDoubleTag(token)) {
            ast.push(token)
        } else if (isRawText(topAst)) {
            topAst.rawText += token.rawText
        } else {
            // Unknown type of tag
            ast.push({ rawText: token.rawText })
        }
    }

    // Empty the stack
    for (const token of stack) {
        // If there's an incomplete double tag on the stack
        if (isDoubleTag(token) && token.children) {
            finalCommit(token)
            for (const child of token.children) {
                finalCommit(child)
            }
            continue
        } else {
            finalCommit(token)
        }
    }

    return ast
}
