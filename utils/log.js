const chalk = require('chalk')
const isBoolean = require('lodash/isBoolean')
const isString = require('lodash/isString')

const debug = function (msg, tips) {
  if (isBoolean(tips)) console.log(chalk`{black.bgCyan  DEBUG } {cyanBright ${msg}}`)
  else if (isString(tips)) console.log(chalk`{black.bgCyan  ${tips} } {cyanBright ${msg}}`)
  else console.log(chalk`{cyanBright ${msg}}`)
}
const sucess = function (msg, tips) {
  if (isBoolean(tips)) console.log(chalk`{black.bgGreen  SUCESS } {greenBright ${msg}}`)
  else if (isString(tips)) console.log(chalk`{black.bgGreen  ${tips} } {greenBright ${msg}}`)
  else console.log(chalk`{greenBright ${msg}}`)
}
const info = function (msg, tips) {
  if (isBoolean(tips)) console.log(chalk`{black.bgBlue  INFO } {blueBright ${msg}}`)
  else if (isString(tips)) console.log(chalk`{black.bgBlue  ${tips} } {blueBright ${msg}}`)
  else console.log(chalk`{blue ${msg}}`)
}
const error = function (msg, tips) {
  if (isBoolean(tips)) console.log(chalk`{black.bgRed  ERROR } {redBright ${msg}}`)
  else if (isString(tips)) console.log(chalk`{black.bgRed  ${tips} } {redBright ${msg}}`)
  else console.log(chalk`{red ${msg}}`)
}
const warn = function (msg, tips) {
  if (isBoolean(tips)) console.log(`${chalk.black.bgKeyword('orange')(' WARN ')} ${chalk.keyword('orange')(msg)}`)
  else if (isString(tips)) console.log(`${chalk.black.bgKeyword('orange')(' ' + tips + ' ')} ${chalk.keyword('orange')(msg)}`)
  else console.log(chalk`{keyword('orange') ${msg}}`)
}

const log = {
  debug,
  sucess,
  info,
  error,
  warn 
}
module.exports = log
