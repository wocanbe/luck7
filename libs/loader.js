'use strict'
const path = require('path')
const log = require('../utils/log')
const generator = require('./generator')

module.exports = function (source, map) {
  this.async()
  // 项目配置
  const configPath = path.resolve('./.luck7rc.js')
  delete require.cache[configPath]
  this.addDependency(configPath)
  let config
  try {
    config = require(configPath)
  } catch (e) {
    log.warn('can not load config from file', true)
    this.callback(null)
    return
  }

  generator(this, config)
    .then((frameCode) => {
      if (config.debug) console.log('---------\n' + frameCode + '\n---------')
      this.callback(null, frameCode)
    })
    .catch((error) => {
      log.error(error.message, true)
      this.callback(error)
    })
}
