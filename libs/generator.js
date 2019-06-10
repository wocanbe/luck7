'use strict'
const fs = require('fs')
const path = require('path')
const compile = require('./compile')
const {hyphen2camel, camel2hyphen} = require('../utils')

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
    const exportName = hyphen2camel('l7-' + pluginName)
    exportNames.push(exportName)
    tasks.push(addPlugin(loader, [camel2hyphen(pluginName), plugin]))
  }
  return Promise.all(tasks).then(pluginsCode => {
    const libsCodes = [] // 需要引入的类库
    const commonCodes = [] // 需要引入的公共方法
    const defineCodes = [] // 代码
    const installCodes = [] // 安装方法
    const configs = [] // 配置
    for (var o in pluginsCode) {
      const p = pluginsCode[o]
      if (p.export) { // 单独处理
        let installCode
        if (p.install) installCode = p.install + '\nexport default ' + exportNames[o]
        const exportCode = compile({
          libs: p.libs,
          common: [p.common],
          defines: [p.define],
          installs: [installCode],
          configs: [p.config]
        })
        fs.writeFileSync(p.export, exportCode, {encoding: 'utf-8'})
      } else {
        if (p.libs) addLibs(libsCodes, p.libs)
        if (p.common) commonCodes.push(p.common)
        if (p.define) defineCodes.push(p.define)
        installCodes.push(p.install)
        exportPlugins.push(exportNames[o])
        if (p.config) configs.push(p.config)
      } 
    }
    const backres = compile({
      libs: libsCodes,
      common: commonCodes,
      defines: defineCodes,
      installs: installCodes,
      configs: configs
    }) + '\n' + 'export {' + exportPlugins.join(', ') + '}'
    return '\'use strict\'\n' + backres
  })
}
module.exports = generateFramework
