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
            throw new Error('No text to process!')
        }

        for (const char of text) {
            console.log('CHAR ::', char)

            if (this.state === STATE_RAW_TEXT) {
                // Is this the beggining of a new tag?
                if (char === config.openTag[0]) {
                    this._commitState()
                    this._transition(STATE_TAG_NAME)
                }
            }
            else if (this.state === STATE_TAG_NAME) {
                // Is this letter the beggining of the tag name?
                if (LOWER_LETTERS.test(char) && !this.pendingState.name) {
                    this.pendingState.name = char
                }
                // Is this letter the middle of a tag name?
                else if (ALL_LETTERS.test(char) && this.pendingState.name) {
                    this.pendingState.name += char
                } else {
                    // delete this.pendingState.name
                    this.pendingState.rawText += char
                    this._commitState()
                    this._transition(STATE_RAW_TEXT)
                    continue
                }
            }
            else if (this.state === STATE_INSIDE_TAG) {
                // Is this the end of a tag?
                if (char === config.closeTag[0]) {
                    this.pendingState.rawText += char
                    this._commitState()
                    this._transition(STATE_RAW_TEXT)
                    continue
                }
            }

            // Just append the text to pendingState
            this.pendingState.rawText += char
        }
    }

    finish() {
        // move the state machine to drop all the pending states
        // and convert all remaining state text to raw-text
        this._commitState()
        this.state = STATE_FINAL

        // some other stuff ...
        return this._processed
    }

    _transition(newState) {
        // console.log(`Transition FROM (${this.state}) TO (${newState})`)
        this.priorState = this.state
        this.state = newState
    }

    _commitState() {
        // Commit old state in the processed list
        // console.log('Commit State:', this.state, this.pendingState)
        if (this.pendingState.rawText) {
            this._processed.push(this.pendingState)
        }
        this.pendingState = { rawText: ''}
    }
}

module.exports = { Parser }
