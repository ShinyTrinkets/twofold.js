const fs = require('fs')
//
// I need validation that I'm not doing something obviously wrong
// so I'm comparing TwoFold with similar libraries,
// by feeding them the same file.
//
const FILE = process.env.HOME + '/Dev/ShinyTrinkets/twofold.js/random1.txt'

function benchNunjucks() {
    const nunjucks = require('nunjucks')
    const label = 'bench-nunjucks'
    console.time(label)
    const txt = fs.readFileSync(FILE, { encoding: 'utf8' })
    nunjucks.renderString(txt)
    console.timeEnd(label)
}

function benchMustache() {
    const mustache = require('mustache')
    const label = 'bench-mustache'
    console.time(label)
    const txt = fs.readFileSync(FILE, { encoding: 'utf8' })
    mustache.render(txt)
    console.timeEnd(label)
}

function benchLiquid() {
    const { Liquid } = require('liquidjs')
    const label = 'bench-liquid'
    console.time(label)
    const txt = fs.readFileSync(FILE, { encoding: 'utf8' })
    const engine = new Liquid()
    engine.parseAndRender(txt)
        .then(() => {
            console.timeEnd(label)
        })
}

module.exports = { benchNunjucks, benchMustache, benchLiquid }
