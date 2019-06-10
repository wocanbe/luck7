'use strict'
const fs = require('fs')
const path = require('path')
const program = require('commander')
const log = require('../utils/log')
const generator = require('./generator')

const params = {
  debug: false,
  file: './.luck7rc.js',
  target: ''
}
program.version('0.1.3')
  .arguments('[target]')
  .action(function (target) {
    params.target = target
  })
  .option('-f, --file <path>', '配置文件')
  .parse(process.argv)

if (program.file) params.file = program.file


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
  addContextDependency () {}
}
generator(loader, config)
  .then((frameCode) => {
    if (params.target) fs.writeFileSync(params.target, frameCode, {encoding: 'utf-8'})
    else log.warn('缺少目标文件，请添加target，或者分别配置各个插件的target', true)
  })
  .catch((error) => {
    log.error(error.message, true)
  })
