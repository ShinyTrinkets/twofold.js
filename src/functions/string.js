function sortLines ({ textInside }) {
  /**
   * TwoFold helper: sort lines of text alphabetically.
   */
  const lines = []
  const group = []
  for (let line of textInside.split(/[\r\n]/)) {
    group.push(line)
    if (!line) {
      group.sort()
      lines.push(group.join('\n'))
      group.length = 0
    }
  }
  if (group.length) {
    group.sort()
    lines.push(group.join('\n'))
  }
  return lines.join('\n')
}

module.exports = {
  sortLines
}
