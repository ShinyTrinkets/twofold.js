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
    for (const f of args._) {
      console.log('(2✂︎f)', f)
      const txt = xfold.renderFile(f)
      fs.writeFileSync(f, txt, { encoding: 'utf8' })
    }
    return
  }
}

main()
