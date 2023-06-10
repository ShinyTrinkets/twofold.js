/**
 * Super basic math functions.
 */

function parseNumber(text) {
    if (typeof text !== 'string') {
        return text
    }
    if (text.indexOf('.') > -1) {
        return parseFloat(text)
    } else {
        return parseInt(text)
    }
}

export function multiply({ text }, { nr = 1 } = {}) {
    /**
     * Multiply the input with a number.
     * The number can be any integer, or float.
     */
    return parseNumber(text) * parseNumber(nr)
}

export function increment({ text }, { nr = 1 } = {}) {
    /**
     * Increment the input with a number.
     * The increment can be any integer, or float, positive or negative.
     */
    return parseNumber(text) + parseNumber(nr)
}
