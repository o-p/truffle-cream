const colors = require('colors')
const util = require('util')

let BN
let wei
let Kwei
let Mwei
let Gwei
let microether
let milliether
let ether
let max

function colorPrintBN(full, amount = 0, unit = '', exp = '') {
    const text = colors.cyan.dim('<BN ') + colors.cyan(full) + colors.cyan.dim('>')
    if (amount) {
        return text
            + ' ' + colors.white(amount) + colors.white.dim(exp)
            + ' ' + colors.yellow.dim('(') + colors.yellow(amount) + colors.yellow.dim(' ' + unit +')')
    }
    return text
}

function bnFormatter(bn) {
    const format = [
        [ether, 'ether', 'e18'],
        [milliether, 'milli-ether', 'e15'],
        [microether, 'micro-ether', 'e12'],
        [Gwei, 'Gwei', 'e9'],
        [Mwei, 'Mwei', 'e6'],
        [Kwei, 'Kwei', 'e3'],
        [wei, 'wei', ''],
    ]
        .find(([base]) => bn.gte(base))

    return Array.isArray(format)
        ? colorPrintBN(bn.toString(), bn.div(format[0]).toString(), format[1], format[2])
        : colorPrintBN(bn.toString())
}

function formatBN(bn, options = {}) {
    const inspect = util.inspect && util.inspect.custom ? util.inspect.custom : 'inspect'
    const formatter = options.bignumberFormatter || bnFormatter

    bn.prototype[inspect] = function (depth, opt) {
        return formatter(this)
    }
}

module.exports = function ({ web3, ...options }) {
    BN = web3.utils.BN
    wei = new BN(1)
    Kwei = new BN(1e3)
    Mwei = new BN(1e6)
    Gwei = new BN(1e9)
    microether = new BN(1e12)
    milliether = new BN(1e15)
    ether = new BN('1000000000000000000')
    max = new BN(Number.MAX_SAFE_INTEGER)

    formatBN(BN, options)
}

