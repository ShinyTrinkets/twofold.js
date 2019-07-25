const fs = require('fs')
const config = require('./config')

const STATE_RAW_TEXT = 's_raw_text'
const STATE_OPEN_TAG = 's_open_tag'
const STATE_CLOSE_TAG = 's_close_tag'
const STATE_CLOSE_TAG2 = 's_close_tag2'
const STATE_TAG_NAME = 's_state_tag_name'
const STATE_TAG_NAME2 = 's_state_tag_name2'
const STATE_INSIDE_TAG = 's_state_inside_tag'
const STATE_INSIDE_TAG2 = 's_state_inside_tag2'
const STATE_TXT_INSIDE = 's_state_txt_inside'
const STATE_PARAM = 's_state_param'
const STATE_EQUAL = 's_state_equal'
const STATE_VALUE = 's_state_value'
const STATE_FINAL = 's_final'

const LOWER_LETTERS = /[a-z]/
const ALL_LETTERS = /[a-zA-Z]/
const ALLOWED_ALPHA = /[_0-9a-zA-Z]/

/*
 * States for text:
 * blah <increment number=5>..</increment> blah
 * .....| STATE_OPEN_TAG
 * ......| STATE_TAG_NAME
 * ...............| STATE_INSIDE_TAG
 * ................| STATE_PARAM
 * .....................| STATE_EQUAL
 * .......................| STATE_VALUE
 * ........................| STATE_CLOSE_TAG

 * This text:
 * blah <increment number=5>..</increment> blah
 * Should become:
 * [
 *   {rawText: 'blah '},
 *   {rawText: '<increment number=5>..</increment>', name: 'increment', param: 'number=5'},
 *   {rawText: ' blah'}
 * ]
 */

class Parser {
    /*
     * A parser is a state machine.
     * The machine moves only when receiving text, or on finish.
     * Push text into the machine to make it process the text.
     * Press "finish" to finish processing all the remaining text
     * and return the processed tags.
     * The parser should never crash, even if the text is "bad".
     */
    constructor() {
        this.state = STATE_RAW_TEXT
        this.priorState = STATE_RAW_TEXT

        // Already processed tags
        this._processed = []

        // Current State Data
        // * rawText - the text that represents the current state
        // * name - the name of the first tag
        // * name2 - the name of the second tag, in case it's a double tag
        // * textInside - text inside the tag
        this.pendingState = { rawText: '' }
    }

    push(text) {
        // Push some text and move the parsing machine.
        // This will consume the block of text completely.
        // If the text represents half of a state,
        // like an open tag, the half of text is kept in pendingState.
        if (this.state === STATE_FINAL) {
            throw new Error('The parsing is finished!')
        } else if (!text) {
            return
        }
        const self = this

        function transition(newState) {
            // console.log(`Transition FROM (${self.state}) TO (${newState})`)
            self.priorState = self.state
            self.state = newState
        }

        function commitAndTransition(newState, joinState) {
            /*
             * Commit old state in the processed list
             * and transition to a new state.
             */
            // console.log('Commit STATE:', self.state, self.pendingState)
            if (self.pendingState.rawText) {
                if (joinState && self.state !== STATE_RAW_TEXT && newState === STATE_RAW_TEXT) {
                    let lastProcessed = { rawText: '' }
                    if (self._processed.length) {
                        lastProcessed = self._processed.pop()
                    }
                    lastProcessed.rawText += self.pendingState.rawText
                    self.pendingState = { rawText: lastProcessed.rawText }
                } else {
                    self._processed.push(self.pendingState)
                    self.pendingState = { rawText: '' }
                }
            }
            transition(newState)
        }

        for (const char of text) {
            // console.log(`CHAR :: ${char} ;; STATE :: ${this.state}`)

            if (this.state === STATE_RAW_TEXT) {
                // Is this the beginning of a new tag?
                if (char === config.openTag[0]) {
                    commitAndTransition(STATE_OPEN_TAG)
                }
                // Just append the text to pendingState
                this.pendingState.rawText += char
                continue
            }

            else if (this.state === STATE_OPEN_TAG) {
                // Is this the beginning of a tag name?
                if (LOWER_LETTERS.test(char)) {
                    this.pendingState.rawText += char
                    this.pendingState.name = char
                    transition(STATE_TAG_NAME)
                }
                // Is this a space before the tag name?
                else if (char === ' ' && !this.pendingState.name) {
                    this.pendingState.rawText += char
                } else {
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            // The end of the first tag
            else if (this.state === STATE_CLOSE_TAG) {
                // Is this the end of a tag?
                if (char === config.closeTag[0]) {
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT)
                } else {
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            // The start of the closing tag, OR the start of a child tag!
            else if (this.state === STATE_CLOSE_TAG2) {
                // Is this the beginning of the closing tag?
                if (char === config.lastStopper[0]) {
                    this.pendingState.rawText += char
                    transition(STATE_TAG_NAME2)
                }
                // DON'T ALLOW CHILD TAGS YET
                else {
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            else if (this.state === STATE_TAG_NAME && this.pendingState.name) {
                // Is this the middle of a tag name?
                if (ALLOWED_ALPHA.test(char)) {
                    this.pendingState.rawText += char
                    this.pendingState.name += char
                }
                // Is this a space after the tag name?
                else if (char === ' ') {
                    this.pendingState.rawText += char
                    transition(STATE_INSIDE_TAG)
                }
                // Is this a tag stopper?
                // In this case, it's a single tag
                else if (char === config.lastStopper[0]) {
                    this.pendingState.rawText += char
                    this.pendingState.single = true
                    transition(STATE_CLOSE_TAG)
                }
                // Is this the end of the First tag from a Double tag?
                else if (char === config.closeTag[0]) {
                    this.pendingState.rawText += char
                    this.pendingState.single = false
                    this.pendingState.textInside = ''
                    transition(STATE_TXT_INSIDE)
                }
                // Abandon current state, back to raw text
                else {
                    delete this.pendingState.name
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            else if (this.state === STATE_TAG_NAME2) {
                // Is this the start of the second tag name?
                if (LOWER_LETTERS.test(char) && !this.pendingState.name2) {
                    this.pendingState.rawText += char
                    this.pendingState.name2 = char
                }
                // Is this the middle of the second tag name?
                else if (ALLOWED_ALPHA.test(char) && this.pendingState.name2) {
                    this.pendingState.rawText += char
                    this.pendingState.name2 += char
                }
                // Is this a space before the tag name?
                else if (char === ' ' && !this.pendingState.name2) {
                    this.pendingState.rawText += char
                }
                // Is this a space after the tag name?
                else if (char === ' ' && this.pendingState.name2) {
                    this.pendingState.rawText += char
                    transition(STATE_INSIDE_TAG2)
                }
                // Is this the end of the Second tag from a Double tag?
                else if (char === config.closeTag[0] && this._hasValidDoubleTag()) {
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT)
                }
                // Abandon current state, back to raw text
                else {
                    delete this.pendingState.name
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            else if (this.state === STATE_INSIDE_TAG) {
                // Is this a tag stopper?
                // In this case, it's a single tag
                if (char === config.lastStopper[0] && this.pendingState.name) {
                    this.pendingState.rawText += char
                    this.pendingState.single = true
                    transition(STATE_CLOSE_TAG)
                }
                // Is this a space inside the tag?
                else if (char === ' ' && this.pendingState.name.trim()) {
                    this.pendingState.rawText += char
                }
                // Is this the end of the First tag from a Double tag?
                else if (char === config.closeTag[0]) {
                    this.pendingState.rawText += char
                    this.pendingState.single = false
                    this.pendingState.textInside = ''
                    transition(STATE_TXT_INSIDE)
                }
                // Is this the beginning of a param name?
                else if (LOWER_LETTERS.test(char)) {
                    this.pendingState.rawText += char
                    this.pendingState.param = char
                    transition(STATE_PARAM)
                } else {
                    delete this.pendingState.name
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            else if (this.state === STATE_INSIDE_TAG2) {
                // Successful parse of a double tag!!
                if (char === config.closeTag[0] && this._hasValidDoubleTag()) {
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT)
                }
                else if (char === ' ') {
                    this.pendingState.rawText += char
                }
                // Abandon current state, back to raw text
                else {
                    delete this.pendingState.name
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            else if (this.state === STATE_PARAM) {
                // Is this the middle of a param name?
                if (ALL_LETTERS.test(char) && this.pendingState.param && this.pendingState.name) {
                    this.pendingState.rawText += char
                    this.pendingState.param += char
                }
                // Is this the equal between key and value?
                else if (char === '=' && this.pendingState.param && this.pendingState.name) {
                    this.pendingState.rawText += char
                    this.pendingState.param += char
                    transition(STATE_EQUAL)
                } else {
                    delete this.pendingState.name
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            else if (this.state === STATE_EQUAL) {
                // Is this the start of a value after equal?
                if (char !== ' ' && char !== config.lastStopper[0] && this.pendingState.param) {
                    this.pendingState.rawText += char
                    this.pendingState.param += char
                    transition(STATE_VALUE)
                } else {
                    delete this.pendingState.name
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            // Anything is valid as a VALUE
            else if (this.state === STATE_VALUE && this.pendingState.name && this.pendingState.param) {
                // Is this a tag stopper?
                // In this case, it's a single tag
                if (char === config.lastStopper[0]) {
                    this.pendingState.rawText += char
                    this.pendingState.single = true
                    transition(STATE_CLOSE_TAG)
                }
                // Is this the end of the First tag from a Double tag?
                else if (char === config.closeTag[0]) {
                    this.pendingState.rawText += char
                    this.pendingState.single = false
                    this.pendingState.textInside = ''
                    transition(STATE_TXT_INSIDE)
                }
                // Is this a space inside the tag?
                else if (char === ' ') {
                    this.pendingState.rawText += char
                    transition(STATE_INSIDE_TAG)
                }
                // Is this the middle of a value after equal?
                else {
                    this.pendingState.rawText += char
                    this.pendingState.param += char
                }
            }

            // Anything is valid as TEXT inside the tag
            else if (this.state === STATE_TXT_INSIDE && this.pendingState.name) {
                // Is this the beginning of the closing tag?
                // Or the beginning of a child tag?
                if (char === config.openTag[0]) {
                    this.pendingState.rawText += char
                    transition(STATE_CLOSE_TAG2)
                } else {
                    this.pendingState.rawText += char
                    this.pendingState.textInside += char
                }
            }

            // UGH SHIT DIS SHOULDN'T HAPPEN
            else {
                console.error('Parser ERROR! This is probably a BUG!')
                console.error(`Char: ${char}; State: ${this.state}; PriorState: ${this.priorState}`)
                commitAndTransition(STATE_RAW_TEXT, true)
            }
        }
    }

    finish() {
        /*
         * Move the machine to drop all the pending states
         * and convert any remaining state text to raw-text.
         */
        if (this.state === STATE_FINAL) {
            throw new Error('The parsing is finished!')
        }

        if (this.pendingState.rawText && this._processed.length) {
            // console.log('Commit FINAL:', this.pendingState)
            const lastProcessed = this._processed[this._processed.length - 1]
            if (lastProcessed.single === undefined) {
                lastProcessed.rawText += this.pendingState.rawText
            } else {
                this._processed.push({ rawText: this.pendingState.rawText })
            }
        } else if (this.pendingState.rawText) {
            // console.log('Create FINAL:', this.pendingState)
            if (this.state === STATE_RAW_TEXT && (this._hasValidDoubleTag() || this._hasValidSingleTag())) {
                this._processed.push(this.pendingState)
            } else {
                this._processed.push({ rawText: this.pendingState.rawText })
            }
        }

        this.pendingState = { rawText: '' }
        this.state = STATE_FINAL
        return this._processed
    }

    _hasValidSingleTag() {
        return this.pendingState.rawText && this.pendingState.single === true && this.pendingState.name
    }

    _hasValidDoubleTag() {
        const s = this.pendingState
        return s.rawText && s.single === false && s.name && s.name2
            && s.name === s.name2 && typeof (s.textInside) === 'string'
    }
}

// async function readFile(fname) {
//     return new Promise(resolve => {
//         const label = `read-${fname}`
//         console.time(label)
//         let fsize = 0
//         const stream = fs.createReadStream(fname, { encoding: 'utf8' })
//         stream.on('data', data => {
//             // console.log(`Received ${data.length} bytes`)
//             fsize += data.length
//         })
//         stream.on('close', () => {
//             console.timeEnd(label)
//             console.log(`Final size ${fsize} bytes`)
//             resolve()
//         })
//     })
// }
// const fname = 'README.md'
// readFile(fname).then(txt => console.log)

module.exports = { Parser }
