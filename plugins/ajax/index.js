const ajaxCommon = `
const _ajax = new Luck7Ajax(l7AjaxConfig.list, l7AjaxConfig.common, l7AjaxConfig.configs, l7AjaxConfig.methods)
const ajax = function (apiName, params) {
  return _ajax.do(apiName, params)
}
const l7AjaxIinstall = function (Vue) {
  Vue.prototype.$ajax = ajax
}`
const install = `
export {ajax}
const l7Ajax = {
  install: l7AjaxIinstall
}`
module.exports = function (loader, options) {
  const common = `import l7AjaxConfig from '${options.config}'${ajaxCommon}`
  const result = {
    libs: ['import Luck7Ajax from \'luck7-ajax\''],
    common,
    install
  }

  const targetFile = options.target
  if (targetFile) result['target'] = targetFile

  return result
}
