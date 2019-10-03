// Credit: https://stackoverflow.com/a/32604073/498361
function toCamelCase(str) {
    return (
        str
            // Replace any - or _ characters with a space
            .replace(/[-_]+/g, ' ')
            // Remove any non alphanumeric characters
            .replace(/[^\w\s]/g, '')
            // Remove space from the start and the end
            .trim()
            // Uppercase the first character in each group immediately following a space
            // (delimited by spaces)
            .replace(/ (.)/g, function($1) {
                return $1.toUpperCase()
            })
            // Remove all spaces
            .replace(/ /g, '')
    )
}

const isDoubleTag = t => t && t.name && t.double
const isSingleTag = t => t && t.name && t.single
const isRawText = t => t && t.name === undefined && t.single === undefined && t.double === undefined

const shouldConsume = t => t.param && t.param.indexOf('replace=true') !== -1

module.exports = {
    toCamelCase,
    isDoubleTag,
    isSingleTag,
    isRawText,
    shouldConsume,
}
