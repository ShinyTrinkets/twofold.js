function sortLines ({ textInside }, { caseSensitive = false } = {}) {
  /**
   * TwoFold helper: sort lines of text alphabetically.
   * By default, the sorting is case insensitive.
   */
  let sortFunc = null
  if (!caseSensitive) {
    sortFunc = (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
  }
  const lines = []
  const group = []
  for (let line of textInside.split(/[\r\n]/)) {
    group.push(line)
    if (!line) {
      group.sort(sortFunc)
      lines.push(group.join('\n'))
      group.length = 0
    }
  }
  if (lines[0] === '' && lines[1] === '') {
    lines.shift()
    lines.push('')
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
