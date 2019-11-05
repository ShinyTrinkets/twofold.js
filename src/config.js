// This is the default config

// The openTag, closeTag and lastStopper must be strings
// of length 1.

// In <random-int />
// If you change open-tag to "{" and close-tag to "}"
// the tag will become: {random-int /}
// It's a good idea to match both the open and close tag
const openTag = '<'
const closeTag = '>'

// In single tag: <random-int />
// If you change last stopper to "?", it will become: <random-int ?>
// In single tag, the stopper only affects the end of the tag
// In double tag: <random-int></random-int>
// If you change it to "?", it will become: <random-int><?random-int>
// In double tags, the stopper only affects the start of the last tag
const lastStopper = '/'

module.exports = { openTag, closeTag, lastStopper }
