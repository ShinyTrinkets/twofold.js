const isDoubleTag = t => !!(t && t.name && t.double)
const isSingleTag = t => !!(t && t.name && t.single && t.rawText)
const isRawText = t => t && t.name === undefined && t.single === undefined && t.double === undefined

const optRenderOnce = t => !!(t && t.params && t.params.once === true)
const optShouldConsume = t => !!(t && t.params && t.params.consume === true)

function getText(node) {
    /*
     * Deeply extract text from a node and all its children.
     */
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
    /*
     * Deeply convert a node and all its children into text.
     */
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

module.exports = {
    getText,
    unParse,
    isRawText,
    isDoubleTag,
    isSingleTag,
    optRenderOnce,
    optShouldConsume,
}
