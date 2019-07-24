const fs = require('fs')
const config = require('./config')

const STATE_RAW_TEXT = 's_raw_text'
const STATE_OPEN_TAG = 's_open_tag'
const STATE_CLOSE_TAG = 's_close_tag'
const STATE_TAG_NAME = 's_state_tag_name'
const STATE_INSIDE_TAG = 's_state_inside_tag'
const STATE_PARAM = 's_state_param'
const STATE_VALUE = 's_state_value'
const STATE_FINAL = 's_final'

const LOWER_LETTERS = /[a-z]/
const ALL_LETTERS = /[a-zA-Z]/

/*
 * States for text:
 * blah <increment number=5>..</increment> blah
 * .....| STATE_OPEN_TAG
 * ......| STATE_TAG_NAME
 * ...............| STATE_INSIDE_TAG
 * ................| STATE_PARAM_NAME
 * .....................| STATE_AFTER_PARAM_NAME
 * .......................| STATE_VALUE_NAME
 * ........................| STATE_CLOSE_TAG

 * This text:
 * blah <increment number=5>..</increment> blah
 * Should become:
 * [ {rawText: 'blah '}, {rawText: '<increment number=5>..</increment>'}, {rawText: ' blah'} ]
 */

class Parser {
    /*
     * A parser is a state machine.
     * Push text into the machine to make it move, aka process text.
     * The machine moves only when receiving text, or on finish.
     * Call finish() to finish processing all the remaining text
     * and return the processed tags.
     * The parser should never crash, even if the text is "bad".
     */
    constructor() {
        // super()
        this.state = STATE_RAW_TEXT
        this.priorState = STATE_RAW_TEXT

        // Already processed tags
        this._processed = []

        // Current State Data
        // * rawText - the text that represents the current state
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

            else if (this.state === STATE_TAG_NAME) {
                // Is this the middle of a tag name?
                if (ALL_LETTERS.test(char) && this.pendingState.name.trim()) {
                    this.pendingState.rawText += char
                    this.pendingState.name += char
                }
                // Is this a space after the tag name?
                else if (char === ' ' && this.pendingState.name.trim()) {
                    this.pendingState.rawText += char
                }
                // Is this a tag stopper?
                else if (char === config.lastStopper[0] && this.pendingState.name) {
                    this.pendingState.rawText += char
                    this._transition(STATE_CLOSE_TAG)
                } else {
                    delete this.pendingState.name
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
                    this._commitAndTransition(STATE_RAW_TEXT)
                }
            }

            // else if (this.state === STATE_INSIDE_TAG) {
            //     // Is this the end of a tag?
            //     if (char === config.closeTag[0]) {
            //         this.pendingState.rawText += char
            //         this._commitAndTransition(STATE_RAW_TEXT)
            //     }
            // }
        }
    }

    finish() {
        // move the state machine to drop all the pending states
        // and convert all remaining state text to raw-text
        this._commitAndTransition(STATE_FINAL)

        // some other stuff ...
        return this._processed
    }

    _commitAndTransition(newState, toProcessed) {
        // Commit old state in the processed list
        // and transition to a new state.

        // console.log('Commit STATE:', this.state, this.pendingState)
        if (this.pendingState.rawText) {
            if (toProcessed && this.state !== STATE_RAW_TEXT && newState === STATE_RAW_TEXT) {
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

module.exports = { Parser }
