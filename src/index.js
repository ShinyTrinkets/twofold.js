const str = require('voca')

const IDENTIFIER = 'replace'
const OPEN_TAG = '<'
const CLOSE_TAG = '>'

function extractBlocks (text) {
  /**
   * Extract all template blocks.
   */
  const lineRegex = new RegExp(`${OPEN_TAG}${IDENTIFIER}-(\\w+) /${CLOSE_TAG}`, 'g')
  const blockRegex = new RegExp(
    `${OPEN_TAG}${IDENTIFIER}-(\\w+)${CLOSE_TAG}[\\w\\W]+?${OPEN_TAG}/${IDENTIFIER}-\\1${CLOSE_TAG}`,
    'g'
  )

  const output = {}
  const addMatch = function (m) {
    output[m.index] = {
      textInside: m[0],
      textBefore: str.substring(text, 0, m.index),
      textAfter: str.substring(text, m.index + m[0].length)
    }
  }

  let matches
  while ((matches = lineRegex.exec(text))) {
    addMatch(matches)
  }
  while ((matches = blockRegex.exec(text))) {
    addMatch(matches)
  }

  return output
}

function renderBlock ({ textBefore, textAfter, textInside }, func) {
  /**
   * TwoFold render function. Super mega basic :)
   */
  return func({ textBefore, textAfter, textInside })
}

module.exports = { extractBlocks, renderBlock }
