const config = require('./config')

const STATE_RAW_TEXT = 's__text'
const STATE_OPEN_TAG = 's_<_tag'
const STATE_CLOSE_TAG = 's_>_tag'
const STATE_TAG_NAME = 's__tag_name'
const STATE_INSIDE_TAG = 's__in_tag'
const STATE_PARAM = 's__param'
const STATE_EQUAL = 's__equal'
const STATE_VALUE = 's__value'
const STATE_FINAL = 's__final'

const LOWER_LETTERS = /[a-z]/
const ALL_LETTERS = /[a-zA-Z]/
const ALLOWED_ALPHA = /[_0-9a-zA-Z]/

/**
 * A lexer is a state machine.
 * The machine moves only when receiving text, or on finish.
 * Push text into the machine to make it process the text.
 * Press "finish" to finish processing all the remaining text
 * and return the processed tags.
 * The lexer should never crash, even if the text is "bad".
 */
class Lexer {
    constructor(customConfig={}) {
        this.state = STATE_RAW_TEXT
        this.priorState = STATE_RAW_TEXT
        this.customConfig = customConfig

        // Already processed tags
        this._processed = []

        // Current State Data
        // * rawText - the text that represents the current state
        // * name  - the name of the tag
        // * param - parameters as key=value
        this.pendingState = { rawText: '' }
    }

    lex(text) {
        // Shortcut function for push + finish
        this.push(text)
        return this.finish()
    }

    push(text) {
        // Push some text and move the lexing machine.
        // This will consume the block of text completely.
        // If the text represents half of a state,
        // like an open tag, the half of text is kept in pendingState.
        if (this.state === STATE_FINAL) {
            throw new Error('The lexing is finished!')
        } else if (!text) {
            return
        }
        const self = this

        const { openTag, closeTag, lastStopper } = Object.assign({}, config, this.customConfig)

        const transition = function(newState) {
            // console.log(`Transition FROM (${self.state}) TO (${newState})`)
            self.priorState = self.state
            self.state = newState
        }

        const commitAndTransition = function(newState, joinState) {
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
                if (char === openTag[0]) {
                    commitAndTransition(STATE_OPEN_TAG)
                }
                // Just append the text to pendingState
                this.pendingState.rawText += char
                continue
            }

            // --
            else if (this.state === STATE_OPEN_TAG) {
                // Is this the beginning of a tag name?
                if (LOWER_LETTERS.test(char)) {
                    this.pendingState.rawText += char
                    this.pendingState.name = char
                    transition(STATE_TAG_NAME)
                }
                // Is this the end of the Second tag from a Double tag?
                else if (
                    char === lastStopper[0] &&
                    !this.pendingState.name &&
                    this.pendingState.rawText === openTag[0]
                ) {
                    this.pendingState.rawText += char
                    this.pendingState.double = true
                }
                // Is this a space before the tag name?
                else if (char === ' ' && !this.pendingState.name) {
                    this.pendingState.rawText += char
                }
                // Abandon current state, back to raw text
                else {
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            // --
            else if (this.state === STATE_CLOSE_TAG) {
                // Is this the end of a tag?
                if (char === closeTag[0]) {
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

            // --
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
                else if (char === lastStopper[0]) {
                    this.pendingState.rawText += char
                    this.pendingState.single = true
                    transition(STATE_CLOSE_TAG)
                }
                // Is this the end of the First tag from a Double tag?
                else if (char === closeTag[0]) {
                    this.pendingState.rawText += char
                    this.pendingState.double = true
                    commitAndTransition(STATE_RAW_TEXT)
                }
                // Abandon current state, back to raw text
                else {
                    delete this.pendingState.name
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            // --
            else if (this.state === STATE_INSIDE_TAG) {
                // Is this a tag stopper?
                // In this case, it's a single tag
                if (char === lastStopper[0] && this.pendingState.name) {
                    this.pendingState.rawText += char
                    this.pendingState.single = true
                    transition(STATE_CLOSE_TAG)
                }
                // Is this a space inside the tag?
                else if (char === ' ' && this.pendingState.name.trim()) {
                    this.pendingState.rawText += char
                }
                // Is this the end of the First tag from a Double tag?
                else if (char === closeTag[0]) {
                    this.pendingState.rawText += char
                    this.pendingState.double = true
                    commitAndTransition(STATE_RAW_TEXT)
                }
                // Is this the beginning of a param name?
                else if (LOWER_LETTERS.test(char)) {
                    this.pendingState.rawText += char
                    this.pendingState.param = char
                    transition(STATE_PARAM)
                }
                // Abandon current state, back to raw text
                else {
                    delete this.pendingState.name
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            // --
            else if (this.state === STATE_PARAM && this.pendingState.param) {
                // Is this the middle of a param name?
                if (ALL_LETTERS.test(char)) {
                    this.pendingState.rawText += char
                    this.pendingState.param += char
                }
                // Is this the equal between key and value?
                else if (char === '=') {
                    this.pendingState.rawText += char
                    this.pendingState.param += char
                    transition(STATE_EQUAL)
                } else {
                    delete this.pendingState.param
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            // --
            else if (this.state === STATE_EQUAL && this.pendingState.param) {
                // Is this the start of a value after equal?
                if (char !== ' ' && char !== lastStopper[0]) {
                    this.pendingState.rawText += char
                    this.pendingState.param += char
                    transition(STATE_VALUE)
                } else {
                    delete this.pendingState.param
                    this.pendingState.rawText += char
                    commitAndTransition(STATE_RAW_TEXT, true)
                }
            }

            // Anything is valid as a VALUE
            // TODO: support spaces inside values
            else if (this.state === STATE_VALUE && this.pendingState.param) {
                // Is this a tag stopper?
                // In this case, it's a single tag
                if (char === lastStopper[0]) {
                    this.pendingState.rawText += char
                    this.pendingState.single = true
                    transition(STATE_CLOSE_TAG)
                }
                // Is this the end of the First tag from a Double tag?
                else if (char === closeTag[0]) {
                    this.pendingState.rawText += char
                    this.pendingState.double = true
                    commitAndTransition(STATE_RAW_TEXT)
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

            // UGH THIS SHOULDN'T HAPPEN
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
         * and convert any remaining state to raw-text.
         */
        if (this.state === STATE_FINAL) {
            throw new Error('The lexing is finished!')
        }

        if (!this._processed.length) {
            this._processed.push({ rawText: '' })
        }

        if (this.pendingState.rawText) {
            const lastProcessed = this._processed[this._processed.length - 1]
            // If the last processed state was a Tag, create a new raw-text
            if (lastProcessed.name) {
                this._processed.push({ rawText: this.pendingState.rawText })
            } else {
                // If the last processed state was raw-text, concatenate
                lastProcessed.rawText += this.pendingState.rawText
            }
        }

        this.pendingState = { rawText: '' }
        this.state = STATE_FINAL
        return this._processed
    }
}

module.exports = { Lexer }
