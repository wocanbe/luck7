'use strict'
const fs = require('fs')
const path = require('path')
const {hyphen2camel, camel2hyphen} = require('../utils')
const log = require('../utils/log')
const compile = require('./compile')

function addPlugin (loader, plugin) {
  let pluginPath = `../plugins/${plugin[0]}`
  if (!fs.existsSync(path.resolve(__dirname, pluginPath))) {
    pluginPath = `${plugin[0]}/luck7/install`
  }
  try { // 安装方法存在
    const install = require(pluginPath)
    let promise
    try {
      promise = install(loader, plugin[1])
      if (!(promise instanceof Promise)) {
        promise = Promise.resolve(promise)
      }
      return promise
    } catch (e) {
      return Promise.reject(e)
    }
  } catch (e) {
    return Promise.reject(new Error(`the plugin ${hyphen2camel(plugin[0])} install file has not found, or has error`))
  }
}
function addLibs (libsArr, addArr) {
  for (var lib of addArr) {
    if (libsArr.indexOf(lib) === -1) {
      libsArr.push(lib)
    }
  }
}

function generateFramework (loader, options) {
  // 最终的插件配置信息
  // 预处理插件
  const plugins = options.plugins || {}
  const exportNames = []
  const exportPlugins = []

  const tasks = [] // 插件安装任务列表
  for (let pluginName in plugins) {
    const plugin = plugins[pluginName]
    if (!plugin) continue
    exportNames.push(pluginName)
    tasks.push(addPlugin(loader, [camel2hyphen(pluginName), plugin]))
  }
  return Promise.all(tasks).then(pluginsCode => {
    const beforeLibs = [] // 需要引入的类库
    const afterLibs = [] // 需要引入的内部库以及不太重要的引入
    const defineCodes = [] // 需要引入的公共方法
    const pluginInstalls = [] // 安装方法
    const configs = [] // 配置
    for (var o in pluginsCode) {
      const p = pluginsCode[o]
      const pluginsName = hyphen2camel('l7-' + exportNames[o])
      let pluginLibs = []
      let pluginConfig = {}
      let pluginInstall = ''
      if (p.libs) pluginLibs = p.libs
      if (p.config) pluginConfig = p.config
      if (p.install) pluginInstall = p.install
      if (p.target) { // 单独处理
        pluginInstall += '\nexport default ' + pluginsName
        const pluginDefine = []
        if (p.define) pluginDefine.push(p.define)
        if (p.utils) pluginLibs = pluginLibs.concat(p.utils)
        const exportCode = compile({
          libs: pluginLibs,
          defines: pluginDefine,
          installs: [pluginInstall],
          configs: [pluginConfig]
        })
        fs.writeFileSync(p.target, exportCode, {encoding: 'utf-8'})
      } else {
        addLibs(beforeLibs, pluginLibs)
        if (p.define) defineCodes.push(p.define)
        if (p.utils) addLibs(afterLibs, p.utils)
        pluginInstalls.push(pluginInstall)
        exportPlugins.push(pluginsName)
        configs.push(pluginConfig)
      } 
    }
    const backres = compile({
      libs: beforeLibs.concat(afterLibs),
      defines: defineCodes,
      installs: pluginInstalls,
      configs: configs
    }) + '\n' + 'export {' + exportPlugins.join(', ') + '}'
    return '\'use strict\'\n' + backres
  })
}
module.exports = generateFramework
