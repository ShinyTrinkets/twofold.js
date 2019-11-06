const fs = require('./fs')
const math = require('./math')
const string = require('./string')
const rand = require('./random')
const time = require('./time')

module.exports = Object.assign({}, fs, math, string, rand, time)
