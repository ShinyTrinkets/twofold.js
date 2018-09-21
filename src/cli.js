#!/usr/bin/env node

const fs = require('fs')
const xfold = require('./')
const minimist = require('minimist')
const cmdOptions = require('minimist-options')

const options = cmdOptions({
  help: {
    alias: 'h',
    type: 'boolean',
    default: false
  },
  'dry-run': {
    alias: 'n',
    type: 'boolean',
    default: false
  },
  // Special option for positional arguments (`_` in minimist)
  arguments: 'string'
})

function main () {
  const args = minimist(process.argv.slice(2), options)

  if (args.help) {
    console.log('TwoFold (2✂︎f) helpful info ...')
    return
  }

  if (args._ && args._.length) {
    for (const fname of args._) {
      if (!fname) {
        continue
      }
      console.log('(2✂︎f)', fname)
      const text = fs.readFileSync(fname, { encoding: 'utf8' })
      if (!text) {
        continue
      }
      const result = xfold.renderText(text)
      if (args.n) {
        console.log(result)
      } else {
        fs.writeFileSync(fname, result, { encoding: 'utf8' })
      }
    }
  } else {
    const stdin = process.stdin
    stdin.setEncoding('utf8')

    let textChunks = ''
    stdin.on('data', function (chunk) {
      textChunks += chunk
    })
    stdin.on('end', function () {
      const result = xfold.renderText(textChunks)
      console.log(result)
    })
    setTimeout(function () {
      if (!textChunks && !textChunks.trim()) {
        process.exit()
      }
    }, 25)
  }
}

main()
