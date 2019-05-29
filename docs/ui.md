# UI加载配置
## 说明

## 示例

```js
module.exports = {
  plugins: {
    ui: {
      theme: '~luck7-ui/src/scss/theme/index', // 要使用的皮肤，默认值如左侧
      components: [ // 要使用的组件
        'badge',
        [ // 可以是数组[componentName, componentConfig]，componentConfig的值需要在组件中做解析处理
          'datepicker',
          {
            weekday: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
            monthList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            weekStart: 1
          }
        ]
      ]
    }
  }
}
