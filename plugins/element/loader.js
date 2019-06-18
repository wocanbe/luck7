'use strict'
const iconStyle=`
@font-face {
  font-family: 'luck7-icons';
  src: url('#{$--font-path}/element-icons.woff') format('woff'), /* chrome, firefox */
       url('#{$--font-path}/element-icons.ttf') format('truetype'); /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  font-weight: normal;
  font-style: normal
}

[class^="el-icon-"], [class*=" el-icon-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'luck7-icons' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
@each $key, $value in $icon-list {
  .el-icon-#{$key}:before {content: #{'"'+ $value + '"'}}
}
.el-icon-loading {
  animation: rotating 2s linear infinite;
}

.el-icon--right {
  margin-left: 5px;
}
.el-icon--left {
  margin-right: 5px;
}

@keyframes rotating {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
`
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
      if (item === 'icon') {
        content += iconStyle
      } else {
        content += `${pathHandler.themePath(item)}\n`
      }
    })
  } else {
    // 组件样式
    opts.components.forEach((item) => {
      content += `${pathHandler.elePath(item)}\n`
    })
  }
  return content
}
