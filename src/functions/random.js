/**
 * Functions for generating randomness, available as tags.
 */

function randomChoice(choices) {
    const index = Math.floor(Math.random() * choices.length)
    return choices[index]
}

export function randomFloat(_, { min = 1, max = 100, decimals = 2 } = {}) {
    /**
     * Generate a random float number.
     * Returns a pseudo-random float in the range min–max (inclusive of min, but not max).
     */
    const precision = parseInt(decimals)
    min = Math.ceil(parseInt(min))
    max = Math.floor(parseInt(max))
    const nr = max - Math.random() * (max - min)
    return nr.toFixed(precision)
}

export function randomInt(_, { min = 1, max = 100 } = {}) {
    /**
     * Generate a random integer number.
     * Returns a pseudo-random integer in the range min–max (inclusive of min, but not max).
     */
    min = Math.ceil(parseInt(min))
    max = Math.floor(parseInt(max))
    return Math.floor(max - Math.random() * (max - min))
}

export function yesOrNo() {
    /**
     * Random Yes or No.
     */
    return randomChoice(['Yes', 'No'])
}

export function leftOrRight(_, { emoji = true } = {}) {
    /**
     * Random left or right (arrow, or text).
     */
    if (emoji) {
        return randomChoice(['←', '→'])
    } else {
        return randomChoice(['left', 'right'])
    }
}

export function upOrDown(_, { emoji = true } = {}) {
    /**
     * Random up or down arrow (arrow, or text).
     */
    if (emoji) {
        return randomChoice(['↑', '↓'])
    } else {
        return randomChoice(['up', 'down'])
    }
}

export function randomSlice() {
    /**
     * Random quadrant (the quarter of a pizza).
     */
    return randomChoice(['◴', '◵', '◶', '◷'])
}

export function randomDice() {
    /**
     * Random die from 1 to 6.
     */
    return randomChoice(['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'])
}

export function randomCard(_, { nr = 0 } = {}) {
    /**
     * Fetch one, or more random game cards.
     * Aces, Twos, Threes, Fours, Fives, Sixes, Sevens, Eights, Nines, Tens,
     * Jacks, Queens, Kings
     * Spades (♠) Hearts (♥) Diamonds (♦) Clubs (♣)
     */
    const suits = ['♤', '♡', '♢', '♧']
    const cards = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']
    const all = []
    for (const c of cards) {
        for (const s of suits) {
            all.push(`${c}${s}`)
        }
    }

    if (nr <= 1) {
        return randomChoice(all)
    }
    const choices = []
    for (let i = 0; i < nr; i++) {
        choices.push(randomChoice(all))
    }
    return choices.join(' ')
}
