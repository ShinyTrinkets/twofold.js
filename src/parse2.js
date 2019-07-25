const fs = require('fs')
const config = require('./config')

const STATE_RAW_TEXT = 's_raw_text'
const STATE_OPEN_TAG = 's_open_tag'
const STATE_CLOSE_TAG = 's_close_tag'
const STATE_TAG_NAME = 's_state_tag_name'
const STATE_INSIDE_TAG = 's_state_inside_tag'
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
        // * name - the name of the tag
        // * name2 - the second of the tag
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

        for (const char of text) {
            // console.log(`CHAR :: ${char} ;; STATE :: ${this.state}`)

            if (this.state === STATE_RAW_TEXT) {
                // Is this the beggining of a new tag?
                if (char === config.openTag[0]) {
                    this._commitAndTransition(STATE_OPEN_TAG)
                }
                // Just append the text to pendingState
                this.pendingState.rawText += char
            }

            else if (this.state === STATE_OPEN_TAG) {
                // Is this the beggining of a tag name?
                if (LOWER_LETTERS.test(char)) {
                    this.pendingState.rawText += char
                    this.pendingState.name = char
                    this._transition(STATE_TAG_NAME)
                }
                // Is this a space before the tag name?
                else if (char === ' ' && !this.pendingState.name) {
                    this.pendingState.rawText += char
                } else {
                    this.pendingState.rawText += char
                    this._commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            else if (this.state === STATE_CLOSE_TAG) {
                // Is this the end of a tag?
                if (char === config.closeTag[0]) {
                    this.pendingState.rawText += char
                    this._commitAndTransition(STATE_RAW_TEXT)
                } else {
                    this.pendingState.rawText += char
                    this._commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            else if (this.state === STATE_TAG_NAME) {
                // Is this the middle of a tag name?
                if (ALLOWED_ALPHA.test(char) && this.pendingState.name.trim()) {
                    this.pendingState.rawText += char
                    this.pendingState.name += char
                }
                // Is this a space after the tag name?
                else if (char === ' ' && this.pendingState.name.trim()) {
                    this.pendingState.rawText += char
                    this._transition(STATE_INSIDE_TAG)
                }
                // Is this a tag stopper?
                // In this case, it's a single tag
                else if (char === config.lastStopper[0] && this.pendingState.name) {
                    this.pendingState.rawText += char
                    this.pendingState.single = true
                    this._transition(STATE_CLOSE_TAG)
                // }
                // // Is this the end of the First tag from a Double tag?
                // else if (char === config.closeTag[0]) {
                //     this.pendingState.rawText += char
                //     this.pendingState.single = false
                //     this._commitAndTransition(STATE_RAW_TEXT)
                } else {
                    delete this.pendingState.name
                    this.pendingState.rawText += char
                    this._commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            else if (this.state === STATE_INSIDE_TAG) {
                // Is this a tag stopper?
                // In this case, it's a single tag
                if (char === config.lastStopper[0] && this.pendingState.name) {
                    this.pendingState.rawText += char
                    this.pendingState.single = true
                    this._transition(STATE_CLOSE_TAG)
                }
                // Is this a space inside the tag?
                else if (char === ' ' && this.pendingState.name.trim()) {
                    this.pendingState.rawText += char
                }
                // Is this the beggining of a param name?
                else if (LOWER_LETTERS.test(char)) {
                    this.pendingState.rawText += char
                    this.pendingState.param = char
                    this._transition(STATE_PARAM)
                } else {
                    delete this.pendingState.name
                    delete this.pendingState.param
                    this.pendingState.rawText += char
                    this._commitAndTransition(STATE_RAW_TEXT, true)
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
                    this._transition(STATE_EQUAL)
                } else {
                    delete this.pendingState.name
                    delete this.pendingState.param
                    this.pendingState.rawText += char
                    this._commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            else if (this.state === STATE_EQUAL) {
                // Is this the start of a value after equal?
                if (char !== ' ' && char !== config.lastStopper[0] && this.pendingState.param) {
                    this.pendingState.rawText += char
                    this.pendingState.param += char
                    this._transition(STATE_VALUE)
                } else {
                    delete this.pendingState.name
                    delete this.pendingState.param
                    this.pendingState.rawText += char
                    this._commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            else if (this.state === STATE_VALUE) {
                // Is this the middle of a value after equal?
                if (char !== ' ' && char !== config.lastStopper[0] && this.pendingState.param) {
                    this.pendingState.rawText += char
                    this.pendingState.param += char
                }
                // Is this a space inside the tag?
                else if (char === ' ' && this.pendingState.param) {
                    this.pendingState.rawText += char
                    this._transition(STATE_INSIDE_TAG)
                }
                // Is this a tag stopper?
                // In this case, it's a single tag
                else if (char === config.lastStopper[0] && this.pendingState.name) {
                    this.pendingState.rawText += char
                    this.pendingState.single = true
                    this._transition(STATE_CLOSE_TAG)
                } else {
                    delete this.pendingState.name
                    delete this.pendingState.param
                    this.pendingState.rawText += char
                    this._commitAndTransition(STATE_RAW_TEXT, true)
                }
            }
        }
    }

    finish() {
        // Move the machine to drop all the pending states
        // and convert any remaining state text to raw-text.
        this._commitAndTransition(STATE_FINAL)
        return this._processed
    }

    _commitAndTransition(newState, joinState) {
        // Commit old state in the processed list
        // and transition to a new state.

        // console.log('Commit STATE:', this.state, this.pendingState)
        if (this.pendingState.rawText) {
            if (joinState && this.state !== STATE_RAW_TEXT && newState === STATE_RAW_TEXT) {
                let lastProcessed = { rawText: '' }
                if (this._processed.length) {
                    lastProcessed = this._processed.pop()
                }
                lastProcessed.rawText += this.pendingState.rawText
                this.pendingState = { rawText: lastProcessed.rawText }
            } else {
                this._processed.push(this.pendingState)
                this.pendingState = { rawText: '' }
            }
        }
        this._transition(newState)
    }

    _transition(newState) {
        // console.log(`Transition FROM (${this.state}) TO (${newState})`)
        this.priorState = this.state
        this.state = newState
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
