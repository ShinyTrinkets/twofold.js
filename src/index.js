const util = require('./util')
const functions = require('./functions')
const { Lexer } = require('./lexer')
const { parse } = require('./parser')

function flattenSingleTag(tag, data, allFunctions) {
    // Convert a single tag into raw text,
    // by evaluating the tag function
    const func = allFunctions[util.toCamelCase(tag.name)]
    let text = tag.rawText
    try {
        text = func({ textInside: tag.rawText }, data)
        delete tag.name
        delete tag.single
        tag.rawText = text.toString()
    } catch (err) {
        console.warn(`Cannot evaluate single ${tag.name}:`, err)
    }
}

function flattenDoubleTag(tag, data, allFunctions) {
    // Deep evaluate all tags, by calling the tag function
    if (tag.children) {
        for (const c of tag.children) {
            if (util.isDoubleTag(c)) {
                flattenDoubleTag(c, data, allFunctions)
            } else if (util.isSingleTag(c)) {
                flattenSingleTag(c, data, allFunctions)
            }
        }
    }
    // At this point all children are flat
    const func = allFunctions[util.toCamelCase(tag.name)]
    let textInside = util.getText(tag)
    let text = textInside
    try {
        text = func({ textInside }, data)
        if (util.shouldConsume(tag)) {
            delete tag.name
            delete tag.param
            delete tag.double
            delete tag.children
            delete tag.firstTagText
            delete tag.secondTagText
            tag.rawText = text.toString()
        } else {
            tag.children = [{ rawText: text.toString() }]
        }
    } catch (err) {
        console.warn(`Cannot evaluate double ${tag.name}:`, err)
    }
}

function renderText(text, data={}, customFunctions={}, customConfig={}) {
    /**
     * TwoFold render text string.
     */
    const allFunctions = Object.assign({}, functions, customFunctions)
    const ast = parse(new Lexer(customConfig).lex(text), customConfig)

    let final = ''
    // Convert single tags into raw text and deep flatten double tags
    for (const t of ast) {
        if (util.isDoubleTag(t)) {
            flattenDoubleTag(t, data, allFunctions)
        } else if (util.isSingleTag(t)) {
            flattenSingleTag(t, data, allFunctions)
        }
        final += util.unParse(t)
    }
    return final
}

module.exports = { renderText }
