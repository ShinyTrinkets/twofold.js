const fs = require('fs')
const util = require('./util')
const functions = require('./functions')
const { Lexer } = require('./lexer')
const { parse } = require('./parser')

async function flattenSingleTag(tag, data, allFunctions) {
    // Convert a single tag into raw text,
    // by evaluating the tag function
    const func = allFunctions[util.toCamelCase(tag.name)]
    const params = Object.assign({}, data, tag.params)
    const text = params.text ? params.text : ''
    let result = tag.rawText
    try {
        result = await func({ text }, params)
        delete tag.name
        delete tag.single
        tag.rawText = result.toString()
    } catch (err) {
        console.warn(`Cannot eval single tag "${tag.name}":`, err.message)
    }
}

async function flattenDoubleTag(tag, data, allFunctions) {
    /*
     * Deep evaluate all tags, by calling the tag function.
     * If the double tag has param consume=true, it will be destroyed
     * after render, just like a single tag.
     * If the double tag has param once=true, it will not be evaluated,
     * if it contains any text inside.
     */
    if (tag.children) {
        for (const c of tag.children) {
            if (util.isDoubleTag(c)) {
                await flattenDoubleTag(c, data, allFunctions)
            } else if (util.isSingleTag(c)) {
                await flattenSingleTag(c, data, allFunctions)
            }
        }
    }
    // At this point all children are flat
    const func = allFunctions[util.toCamelCase(tag.name)]
    const params = Object.assign({}, data, tag.params)
    const text = util.getText(tag)
    if (text && tag.params && tag.params.once === 'true') {
        return
    }
    let result = text
    try {
        result = await func({ text }, params)
        if (util.shouldConsume(tag)) {
            delete tag.name
            delete tag.double
            delete tag.params
            delete tag.children
            delete tag.firstTagText
            delete tag.secondTagText
            tag.rawText = result.toString()
        } else {
            tag.children = [{ rawText: result.toString() }]
        }
    } catch (err) {
        console.warn(`Cannot eval double tag "${tag.name}":`, err.message)
    }
}

async function renderText(text, data = {}, customFunctions = {}, customConfig = {}) {
    /**
     * TwoFold render text string.
     */
    const allFunctions = Object.assign({}, functions, customFunctions)
    // const label = 'tf-' + (Math.random() * 100 * Math.random()).toFixed(6)
    // console.time(label)
    const ast = parse(new Lexer(customConfig).lex(text), customConfig)

    let final = ''
    // Convert single tags into raw text and deep flatten double tags
    for (const t of ast) {
        if (util.isDoubleTag(t)) {
            await flattenDoubleTag(t, data, allFunctions)
        } else if (util.isSingleTag(t)) {
            await flattenSingleTag(t, data, allFunctions)
        }
        final += util.unParse(t)
    }
    // console.timeEnd(label)
    return final
}

async function renderStream(stream, data = {}, customFunctions = {}, customConfig = {}) {
    const allFunctions = Object.assign({}, functions, customFunctions)

    return new Promise(resolve => {
        // const label = 'tf-' + (Math.random() * 100 * Math.random()).toFixed(6)
        // console.time(label)
        const lex = new Lexer(customConfig)

        stream.on('data', text => {
            lex.push(text)
        })
        stream.on('close', async () => {
            const ast = parse(lex.finish(), customConfig)
            let final = ''

            // Convert single tags into raw text and deep flatten double tags
            for (const t of ast) {
                if (util.isDoubleTag(t)) {
                    await flattenDoubleTag(t, data, allFunctions)
                } else if (util.isSingleTag(t)) {
                    await flattenSingleTag(t, data, allFunctions)
                }
                final += util.unParse(t)
            }

            // console.timeEnd(label)
            resolve(final)
        })
    })
}

async function renderFile(fname, data = {}, customFunctions = {}, customConfig = {}) {
    const stream = fs.createReadStream(fname, { encoding: 'utf8' })
    return renderStream(stream, data, customFunctions, customConfig)
}

module.exports = { renderText, renderStream, renderFile }
