'use strict'
const _ = require('lodash')

module.exports = function (content, map) {
  const opts = JSON.parse(this.query.split('=')[1])
  const pathHandler = {
    normalPath: (filePath) => `@import '${filePath}';`,
    componentPath: (componentName) => `@import '~luck7-ui/src/scss/modules/${componentName}';`
  }
  // 工具及方法样式
  let toolsStyles = `${pathHandler.normalPath('~luck7-ui/src/scss/tools/index')}\n`
  content = toolsStyles + content
  // 皮肤样式
  content += `${pathHandler.normalPath(opts.theme)}\n`
  // 组件样式
  opts.components.forEach((item) => {
    content += `${pathHandler.componentPath(item)}\n`
  })
  return content
}
