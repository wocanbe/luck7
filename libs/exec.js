'use strict'
const fs = require('fs')
const path = require('path')
const program = require('commander')
const log = require('../utils/log')
const generator = require('./generator')

const params = {
  debug: false,
  config: './.luck7rc.js',
  target: ''
}
program.version('0.1.3')
  .arguments('[target]')
  .action(function (target) {
    params.target = target
  })
  .option('-c, --config <path>', '配置文件')
  .parse(process.argv)

if (program.config) params.config = program.config


const configPath = path.resolve(params.file)
delete require.cache[configPath]
let config
try {
  config = require(configPath)
} catch (e) {
  log.warn('can not load config from file', true)
  return
}
const loader = {
  resourcePath: path.resolve(params.target), // 兼容webpack写法，也可以用来计算相对路径
  addContextDependency () {}, // 没用，为了兼容webpack写法，调用时不报错
  context: '' // 没用，为了兼容webpack写法，调用时不报错
}
generator(loader, config)
  .then((frameCode) => {
    if (params.target) fs.writeFileSync(params.target, frameCode, {encoding: 'utf-8'})
    else log.warn('缺少目标文件，请添加target，或者分别配置各个插件的target', true)
  })
  .catch((error) => {
    log.error(error.message, true)
  })
