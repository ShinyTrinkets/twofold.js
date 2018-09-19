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
    console.log('TwoFold.js (2✂︎f) helpful info ...')
  }
}

main()
