'use strict'
const loaderAalias = require('./libs/aliasPlugin')
module.exports = function (config) {
  let rules = []

  rules = rules.concat(config.module.rules)
  // 框架 loader
  rules = rules.concat(loaderAalias.main)
  // 内部插件 loader
  rules = rules.concat(loaderAalias.plugins)

  config.module.rules = rules

  return config
}
