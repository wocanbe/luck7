const {components, globalComponents, directive, global} = require('./configs')
const {camel2hyphen} = require('luck7/utils')

function loadStyles (cmpts, theme, supportSkin) {
  const styles = []
  for (let i = 0; i < cmpts.length; i++) {
    if (components.includes(cmpts[i]) || globalComponents.includes(cmpts[i])) styles.push(camel2hyphen(cmpts[i]))
  }
  const styleConfig = {
    components: styles,
    theme,
    supportSkin
  }
  const utilsFile = 'luck7/utils/loaderUtils.js'
  const loaderFile = 'luck7/plugins/element/loader.js'
  const themeFile = 'luck7/plugins/element/style.scss'
  return `require('${utilsFile}?loader=${loaderFile}&opts=${JSON.stringify(styleConfig)}!${themeFile}')`
}

function loadCmpts (cmps, cmpts, ocmpts) {
  let install = ''
  for (const cmp of cmps) {
    if (components.includes(cmp)) {
      const cmpDir = camel2hyphen(cmp)
      cmpts.push(`element-ui/lib/${cmpDir}.js|filelink`)
    } else if (globalComponents.includes(cmp)) { // element的全局组件不在ui组件列表中，不需要注册为vue组件，所以要分开处理
      const cmpDir = camel2hyphen(cmp)
      const dictInfo = directive[cmp]
      const globalInfo = global[cmp]
      const cmpOrder = ocmpts.length
      if (dictInfo) {
        install += `  Vue.use(l7ElCfg.ocmpts[${cmpOrder}].${dictInfo})\n`
      }
      if (globalInfo) {
        for (const g in globalInfo) {
          if (globalInfo[g] === 'default') {
            install += `  Vue.prototype.$${g}=l7ElCfg.ocmpts[${cmpOrder}]\n`
          } else {
            install += `  Vue.prototype.$${g}=l7ElCfg.ocmpts[${cmpOrder}].${globalInfo[g]}\n`
          }
        }
      }
      ocmpts.push(`element-ui/lib/${cmpDir}.js|filelink`)
    }
  }
  return install
}
module.exports = {loadStyles, loadCmpts}
