const str = require('voca')
const helpers = require('./helpers')

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

function extractBlocks (text) {
  /**
   * Extract all template blocks.
   */
  const lineRegex = new RegExp(`${OPEN_TAG}[ ]*${IDENTIFIER}-((?:\\w+-)*\\w+)[ ]+${LAST_STOPPER}[ ]*${CLOSE_TAG}`, 'g')
  const blockRegex = new RegExp(
    `(${OPEN_TAG}${IDENTIFIER}-((?:\\w+-)*\\w+)${FIRST_STOPPER}${CLOSE_TAG})` +
      `([\\w\\W]*?)` +
      `(${OPEN_TAG}${LAST_STOPPER}${IDENTIFIER}-\\2${CLOSE_TAG})`,
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

function renderText (text, data, customHelpers) {
  /**
   * TwoFold render text string.
   */
  const allHelpers = Object.assign({}, helpers, customHelpers)
  const blocks = extractBlocks(text)
  for (const b of blocks) {
    if (!b.name) {
      // maybe a debug message ?
      // shouldn't be necessary, because maybe the block is intentionally invalid
      continue
    }
    const func = allHelpers[str.camelCase(b.name)]
    const result = func(b, data)
    // Self destructing tag
    // TODO: This is buggy, so fit it
    if (!b.tagAfter) {
      text = b.textBefore + result + b.textAfter
    } else {
      text = b.textBefore + b.tagBefore + result + b.tagAfter + b.textAfter
    }
  }
  return text
}

module.exports = { extractBlocks, renderText }
