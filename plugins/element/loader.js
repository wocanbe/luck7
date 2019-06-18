'use strict'
module.exports = function (content, map) {
  const opts = JSON.parse(this.query.split('=')[1])
  const pathHandler = {
    elePath: (componentName) => `@import '~element-ui/lib/theme-chalk/${componentName}.css';`,
    themePath: (componentName) => `@import '~element-theme-chalk/src/${componentName}';`
  }
  if (opts.supportSkin) {
    // 皮肤样式
    if (opts.theme) content += `@import '${opts.theme}';\n`
    // element公共样式
    content += '$--font-path: \'~element-theme-chalk/src/fonts\'!default;\n'
    content += '@import \'~element-theme-chalk/src/base.scss\';\n'
    // 组件样式
    opts.components.forEach((item) => {
      content += `${pathHandler.themePath(item)}\n`
    })
  } else {
    // 组件样式
    opts.components.forEach((item) => {
      content += `${pathHandler.elePath(item)}\n`
    })
  }
  return content
}
