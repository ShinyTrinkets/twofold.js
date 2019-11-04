const fs = require('fs')
//
// I need validation that I'm not doing something obviously wrong
// so I'm comparing TwoFold with similar libraries,
// by feeding them the same file.
//
// To generate a big random file in Python:
// import os, base64
// base64.a85encode(os.urandom(396_040), wrapcol=100).replace(b'{',b'x')
// open('random.txt', 'wb').write(txt)
//
const file = 'random.txt'
const text = fs.readFileSync(file, { encoding: 'utf8' })

function benchTwofold() {
    const twofold = require('../src')
    const label = 'bench-twofold'
    console.time(label)
    twofold.renderText(text)
    console.timeEnd(label)
}

function benchNunjucks() {
    const nunjucks = require('nunjucks')
    const label = 'bench-nunjucks'
    console.time(label)
    nunjucks.renderString(text)
    console.timeEnd(label)
}

function benchMustache() {
    const mustache = require('mustache')
    const label = 'bench-mustache'
    console.time(label)
    mustache.render(text)
    console.timeEnd(label)
}

function benchLiquid() {
    const { Liquid } = require('liquidjs')
    const label = 'bench-liquid'
    console.time(label)
    const engine = new Liquid()
    engine.parseAndRender(text)
        .then(() => {
            console.timeEnd(label)
        })
}

module.exports = { benchTwofold, benchNunjucks, benchMustache, benchLiquid }
