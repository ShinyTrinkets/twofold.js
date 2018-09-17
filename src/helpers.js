function increment ({ textInside }, number = 1) {
  /**
   * TwoFold helper: increment a number.
   */
  return parseInt(textInside) + number
}

function sort ({ textInside }) {
  /**
   * TwoFold helper: increment a number.
   */
  const lines = textInside.split(/[\r\n]/)
  lines.sort()
  return lines.join('\n')
}

module.exports = { increment, sort }
