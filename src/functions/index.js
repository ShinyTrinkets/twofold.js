const math = require('./math')
const string = require('./string')
const rand = require('./random')
const time = require('./time')

module.exports = Object.assign({}, math, string, rand, time)
