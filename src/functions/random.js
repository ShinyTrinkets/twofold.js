function randomChoice(choices) {
    const index = Math.floor(Math.random() * choices.length)
    return choices[index]
}

function randomFloat(_, { min = 1, max = 100 } = {}) {
    /**
     * Return a random float number.
     * Returns a pseudo-random float in the range min–max (inclusive of min, but not max).
     */
    return Math.random() * (max - min) + min
}

function randomInt(_, { min = 1, max = 100 } = {}) {
    /**
     * Return a random integer number.
     * Returns a pseudo-random integer in the range min–max (inclusive of min, but not max).
     */
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function yesOrNo() {
    /**
     * Random Yes or No.
     */
    return randomChoice(['Yes', 'No'])
}

function leftOrRight(_, { emoji = true } = {}) {
    /**
     * Random left or right (arrow, or text).
     */
    if (emoji) {
        return randomChoice(['←', '→'])
    } else {
        return randomChoice(['left', 'right'])
    }
}

function upOrDown(_, { emoji = true } = {}) {
    /**
     * Random up or down arrow (arrow, or text).
     */
    if (emoji) {
        return randomChoice(['↑', '↓'])
    } else {
        return randomChoice(['up', 'down'])
    }
}

function randomSlice() {
    /**
     * Random quadrant (the quarter of a pizza).
     */
    return randomChoice(['◴', '◵', '◶', '◷'])
}

function randomDice() {
    /**
     * Random die from 1 to 6.
     */
    return randomChoice(['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'])
}

function randomCard() {
    /**
     * Get a random game card.
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
    return randomChoice(all)
}

module.exports = {
    randomFloat,
    randomInt,
    leftOrRight,
    upOrDown,
    yesOrNo,
    randomSlice,
    randomDice,
    randomCard,
}
