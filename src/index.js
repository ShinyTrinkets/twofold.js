const util = require('./util')
const functions = require('./functions')
const { Lexer } = require('./lexer')
const { parse } = require('./parser')

function renderText(text, data={}, customFunctions={}, customConfig={}) {
    /**
     * TwoFold render text string.
     */
    const allHelpers = Object.assign({}, functions, customFunctions)
    const ast = parse(new Lexer(customConfig).lex(text), customConfig)
    // console.log('-R- PARSED ::', JSON.stringify(ast, null, ' '), '\n')

    for (const t of ast) {
        if (util.isDoubleTag(t)) {
            const func = allHelpers[util.toCamelCase(t.name)]
            let textInside = ''
            if (!t.children) {
                t.children = []
            }
            for (const c of t.children) {
                textInside += c.rawText
            }
            let result = textInside
            try {
                result = func({ textInside }, data)
            } catch (err) {
                console.warn(`Error executing double ${t.name}:`, err)
            }
            t.children = [{ rawText: result.toString() }]
        } else if (util.isSingleTag(t)) {
            const func = allHelpers[util.toCamelCase(t.name)]
            let result = t.rawText
            try {
                result = func({ textInside: t.rawText }, data)
                t.rawText = result.toString()
            } catch (err) {
                console.warn(`Error executing single ${t.name}:`, err)
            }
        }
    }
    // console.log('-R- PROCESSED ::', JSON.stringify(ast, null, ' '), '\n')

    let final = ''
    for (const t of ast) {
        if (util.isDoubleTag(t)) {
            final += t.firstTagText
            for (const c of t.children) {
                final += c.rawText
            }
            final += t.secondTagText
        } else {
            final += t.rawText
        }
    }
    return final
}

module.exports = { renderText }
