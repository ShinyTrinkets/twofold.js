const util = require('./util')
const functions = require('./functions')

// As in <replace-random-int />
// If you change it to "x", it will become: <x-random-int />
const IDENTIFIER = 'replace'

// In <replace-random-int />
// If you change it to "?", it will become: <replace-random-int ?>
// In single tag, the stopper only affects the end of the tag
// In <replace-random-int></replace-random-int>
// If you change it to "?", it will become: <replace-random-int><?replace-random-int>
// In double tags, the stopper only affects the start of the last tag
const LAST_STOPPER = '/'
// In <replace-random-int></replace-random-int>
// If you change it to "?", it will become: <replace-random-int?></replace-random-int>
// In <replace-random-int> </replace-random-int>,
// If you change first stopper to ">" and last stopper to "<" it will become:
// <replace-random-int>> <<replace-random-int>
// Second stopper only affects the end of the first tag, for double tags
const FIRST_STOPPER = ''

// As in <replace-random-int />
// If you change OPEN_TAG to "{" and CLOSE_TAG to "}"
// it will become: {replace-random-int /}
const OPEN_TAG = '<'
const CLOSE_TAG = '>'

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

function extractBlock (text) {
  /**
   * Extract the first template block.
   */
  const lineRegex = new RegExp(`${OPEN_TAG}[ ]*${IDENTIFIER}-((?:\\w+-)*\\w+)[ ]+${LAST_STOPPER}[ ]*${CLOSE_TAG}`, 'g')
  const blockRegex = new RegExp(
    `(${OPEN_TAG}${IDENTIFIER}-((?:\\w+-)*\\w+)${FIRST_STOPPER}${CLOSE_TAG})` +
      `([\\w\\W]*?)` +
      `(${OPEN_TAG}${LAST_STOPPER}${IDENTIFIER}-\\2${CLOSE_TAG})`,
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

function renderText (text, data, customFunctions) {
  /**
   * TwoFold render text string.
   */
  const allHelpers = Object.assign({}, functions, customFunctions)
  const b = extractBlock(text)
  if (!b || !b.name) {
    return text
  }
  const func = allHelpers[util.toCamelCase(b.name)]
  const endText = renderText(b.textAfter, data, customFunctions)
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
