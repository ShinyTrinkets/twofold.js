// In <replace-random-int />
// If you change identifier to "x", the tag will become: <x-random-int />
const identifier = 'replace'

// In <replace-random-int />
// If you change open-tag to "{" and close-tag to "}"
// the tag will become: {replace-random-int /}
const openTag = '<'
const closeTag = '>'

// In single tag: <replace-random-int />
// If you change last stopper to "?", it will become: <replace-random-int ?>
// In single tag, the stopper only affects the end of the tag
// In double tag: <replace-random-int></replace-random-int>
// If you change it to "?", it will become: <replace-random-int><?replace-random-int>
// In double tags, the stopper only affects the start of the last tag
const lastStopper = '/'

// DEPRECATED !!
// In <replace-random-int></replace-random-int>
// If you change first stopper to "?", it will become: <replace-random-int?></replace-random-int>
// In <replace-random-int> </replace-random-int>
// If you change first stopper to ">" and last stopper to "<" it will become:
// <replace-random-int>> <<replace-random-int>
// First stopper only affects double tags, at the end of the first tag
const firstStopper = ''

module.exports = { identifier, openTag, closeTag, lastStopper }
