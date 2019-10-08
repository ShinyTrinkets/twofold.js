function multiply({ text }, { number = 1 } = {}) {
    /**
     * Multiply the input with a number.
     * The number can be any integer, or float.
     */
    if (text.indexOf('.') > -1) {
        return parseFloat(text) * number
    } else {
        return parseInt(text) * number
    }
}

function increment({ text }, { number = 1 } = {}) {
    /**
     * Increment the input with a number.
     * The increment can be any integer, or float, positive or negative.
     */
    if (text.indexOf('.') > -1) {
        return parseFloat(text) + number
    } else {
        return parseInt(text) + number
    }
}

module.exports = {
    multiply,
    increment,
}
