const util = require('./util')
const config = require('./config')
const functions = require('./functions')

function lineMatchResult (m, text) {
  return {
    index: m.index,
    name: m[1], // the block name
    textInside: '', // text inside the block
    tagBefore: m[0],
    tagAfter: '',
    textBefore: text.substring(0, m.index), // text before the block
    textAfter: text.substring(m.index + m[0].length) // text after the block
  }
}

function blockMatchResult (m, text) {
  return {
    index: m.index,
    name: m[2], // the block name
    textInside: m[3], // text inside the block
    tagBefore: m[1],
    tagAfter: m[4],
    textBefore: text.substring(0, m.index), // text before the block
    textAfter: text.substring(m.index + m[0].length) // text after the block
  }
}

function extractBlock (text, customConfig) {
  /**
   * Extract the first found template block.
   */
  const { identifier, openTag, closeTag, lastStopper, firstStopper } = Object.assign({}, config, customConfig)
  const lineRegex = new RegExp(
    `${openTag}` + // Open the tag
    `[ ]*` + // Zero or more spaces
    `(?:${identifier}-)?` + // Optional identifier (replace, insert, append)
    `((?:\\w+-)*\\w+)` + // The name of the template function
    `[ ]+` + // One or more spaces
    `${lastStopper}` + // The stopper char
    `[ ]*` + // Zero or more spaces
    `${closeTag}`, // Close the tag
    'g'
  )
  const blockRegex = new RegExp(
    `(${openTag}${identifier}-((?:\\w+-)*\\w+)${firstStopper}${closeTag})` +
      `([\\w\\W]*?)` + // Text inside the tmpl
      `(${openTag}${lastStopper}${identifier}-\\2${closeTag})`,
    'g'
  )
  // Match single tag
  const lm = lineRegex.exec(text)
  // Match double tag
  const bm = blockRegex.exec(text)
  // If nothing matches, the result is null
  if (!lm && !bm) {
    return null
  }
  // If only one matches, return that one
  if (lm && !bm) {
    return lineMatchResult(lm, text)
  } else if (bm && !lm) {
    return blockMatchResult(bm, text)
  }
  // If both match, return the smaller index
  if (lm.index < bm.index) {
    return lineMatchResult(lm, text)
  } else {
    return blockMatchResult(bm, text)
  }
}

function renderText (text, data, customFunctions, customConfig) {
  /**
   * TwoFold render text string.
   */
  const allHelpers = Object.assign({}, functions, customFunctions)
  const b = extractBlock(text, customConfig)
  if (!b || !b.name) {
    return text
  }
  const func = allHelpers[util.toCamelCase(b.name)]
  const endText = renderText(b.textAfter, data, customFunctions, customConfig)
  let result
  try {
    result = func(b, data)
  } catch (err) {
    if (!b.tagAfter) {
      // Single tag
      return b.textBefore + b.tagBefore + endText
    } else {
      return b.textBefore + b.tagBefore + b.textInside + b.tagAfter + endText
    }
  }
  if (!b.tagAfter) {
    // Single tag
    return b.textBefore + result + endText
  } else {
    return b.textBefore + b.tagBefore + result + b.tagAfter + endText
  }
}

module.exports = { extractBlock, renderText }
