const log = require('../../utils/log')
const {loadStyles, loadCmpts} = require('./code')
const {lang} = require('./configs')
module.exports = function (loader, options) {
  let hasEle, supportSkin
  try {
    hasEle = !!require.resolve('element-ui')
  } catch (e) {
    log.error('element-ui has not installed,please install', true)
  }
  if (!hasEle) return {install: 'const l7Element={install () {console.error(\'element-ui has not installed,please install\')}}'}
  try {
    supportSkin = !!require.resolve('element-theme-chalk')
  } catch (e) {
    supportSkin = false
  }
  if (!supportSkin) log.warn('Don\'t exist element-theme-chalk,can\'t use custom theme', true)
  const cmps = options.components

  const styleCode = loadStyles(cmps, options.theme, supportSkin)
  const config = {
    cmpts: [],
    ocmpts: [],
    lang: [],
    i18n: undefined
  }
  // eslint-disable-next-line
  let install = 'const l7ElCfg = ${config}\n'
  install += 'const l7EleInstall = function(Vue) {\n'
  install += '  if (l7EleInstall.installed) return\n'
  if (options.lang) { // 多语言支持
    if (lang.includes(options.lang)) {
      config.lang.push('element-ui/src/locale|filelink')
      install += `  l7ElCfg.lang[0].use(l7ElCfg.lang[${config.lang.length}])\n`
      config.lang.push(`element-ui/src/locale/lang/${options.lang}|filelink`)
    } else {
      log.warn('不支持的语言种类' + options.lang, true)
    }
  }
  /**
   * 多语言支持
   * 这儿不引入i18n等库，采用element-ui的``按需加载里定制 i18n``部分的方法
   * options.i18n指向一个文件，该文件导出i18n的翻译方法
   */
  if (options.i18n) {
    if (config.lang.length === 0) config.lang.push('element-ui/src/locale|filelink')
    install += 'l7ElCfg.lang[0].i18n((key, value) => l7ElCfg.i18n.t(key, value))'
    config.i18n = `${options.i18n}|filelink`
  }
  install += '  l7ElCfg.cmpts.forEach(cmp => {\n'
  install += '    Vue.component(cmp.name, cmp)\n'
  install += '  })\n'
  install += loadCmpts(cmps, config.cmpts, config.ocmpts)
  install += '}\nconst l7Element={install:l7EleInstall}'

  const result = {
    libs: [styleCode],
    config,
    install
  }

  const targetFile = options.target
  if (targetFile) result['export'] = targetFile

  return result
}
