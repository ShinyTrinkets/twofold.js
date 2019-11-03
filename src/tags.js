const isDoubleTag = t => !!(t && t.name && t.double)
const isSingleTag = t => !!(t && t.name && t.single && t.rawText)
const isRawText = t => t && t.name === undefined && t.single === undefined && t.double === undefined

const optRenderOnce = t => !!(t && t.params && t.params.once === 'true')
const optShouldConsume = t => !!(t && t.params && t.params.consume === 'true')

module.exports = {
    isRawText,
    isDoubleTag,
    isSingleTag,
    optRenderOnce,
    optShouldConsume,
}
