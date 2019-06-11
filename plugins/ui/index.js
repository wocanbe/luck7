const isArray = require('lodash/isArray')
const componentsList = require('luck7-ui/components')

function loadComponents (components, libs) {
  const vueComponents = []
  for (let i = 0; i < components.length; i++) {
    let component = components[i]
    if (!isArray(component)) component = [component]
    if (componentsList.vue.includes(component[0])) { // vue模块，有些组件如animate没有js/vue文件，需要跳过去
      const cmpConfig = component[1] ? component[1] : {}
      vueComponents.push({
        'component|filelink': `luck7-ui/src/components/${component[0]}`,
        config: cmpConfig
      })
    }
  }
  return vueComponents
}

function loadStyles (components, theme) {
  const scssComponents = []
  for (let i = 0; i < components.length; i++) {
    let component = components[i]
    if (!isArray(component)) component = [component]
    scssComponents.push(component[0]) // 目前不存在只有js没有css的组件，所以所有组件都加进去
  }
  const styleConfig = {
    components: scssComponents,
    theme: theme
  }
  const utilsFile = 'luck7/utils/loaderUtils.js'
  const loaderFile = 'luck7/plugins/ui/loader.js'
  const themeFile = 'luck7/plugins/ui/theme.scss'
  return `require('${utilsFile}?loader=${loaderFile}&opts=${JSON.stringify(styleConfig)}!${themeFile}')`
}
/**
 * 递归解析组件，并返回去重后的组件列表
 * @param {*} components 要解析的组件列表
 * @param {*} cmptsList 要返回的组件列表
 */
function getCmpts (components, cmptsList) {
  // if (!isArray(cmptsList)) cmptsList = []
  if (isArray(components)) {
    for (var key of components) {
      if (!cmptsList.includes(key)) {
        cmptsList.push(key)
        const cmpsDps = componentsList.dependencies[key]
        if (cmpsDps) getCmpts(cmpsDps, cmptsList)
      }
    }
  }
  return cmptsList
}

module.exports = function (loader, options) {
  const theme = options.theme || '~luck7-ui/src/scss/theme/index'
  const components = getCmpts(options.components, [])
  const styleConfig = loadStyles(components, theme)

  const libs = [styleConfig]

  const componentsConfig = loadComponents(components, libs)
  // eslint-disable-next-line
  let install = 'const l7UiCmps = ${config}\n'
  install += 'function l7UiInstall (Vue) {\n'
  install += '  if (l7UiInstall.installed) return\n'
  install += '  l7UiCmps.map(item => Vue.use(item.component, item.config))\n'
  install += '}\n'
  install += 'const l7Ui = {install: l7UiInstall}'

  const result = {
    libs: libs,
    config: componentsConfig,
    // eslint-disable-next-line
    install: install
  }
  const targetFile = options.target
  if (targetFile) result['target'] = targetFile

  return result
}
