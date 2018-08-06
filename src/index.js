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
    `(${OPEN_TAG}${IDENTIFIER}-(\\w+)${CLOSE_TAG})([\\w\\W]+?)(${OPEN_TAG}/${IDENTIFIER}-\\2${CLOSE_TAG})`,
    'g'
  )

  let m
  const output = []

  while ((m = lineRegex.exec(text))) {
    output.push({
      index: m.index,
      name: m[1], // the block name
      textInside: '', // text inside the block
      tagBefore: m[0],
      tagAfter: '',
      textBefore: str.substring(text, 0, m.index), // text before the block
      textAfter: str.substring(text, m.index + m[0].length) // text after the block
    })
  }
  while ((m = blockRegex.exec(text))) {
    output.push({
      index: m.index,
      name: m[2], // the block name
      textInside: m[3], // text inside the block
      tagBefore: m[1],
      tagAfter: m[4],
      textBefore: str.substring(text, 0, m.index), // text before the block
      textAfter: str.substring(text, m.index + m[0].length) // text after the block
    })
  }

  return output
}

function renderText (text, data) {
  /**
   * TwoFold render function.
   */
  const blocks = extractBlocks(text)
  for (const b of blocks) {
    const func = data[b.name]
    const result = func(b)
    text = b.textBefore + b.tagBefore + result + b.tagAfter + b.textAfter
  }
  return text
}

module.exports = { extractBlocks, renderText }
