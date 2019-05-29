# luck7

一个框架加载的loader,通过读取配置文件(``.luck7rc.js``)的配置进行加载

## 配置loader

 - 使用方法1: 通过框架添加loader

```javascript
var luck7 = require('luck7')
var webpackConfig = require('./webpack.conf')
module.exports = luck7(webpackConfig)
```

 - 使用方法2: 手工配置loader

在webpack的loader添加如下代码

```javascript
{
  test: require.resolve('luck7/plugins'),
  use: [
    'babel-loader', // 需要在.babelrc中添加syntax-dynamic-import插件
    'luck7/libs/loader'
  ],
  // loader: ['babel-loader?plugins[]=syntax-dynamic-import', 'luck7/libs/loader']
}
```

## 使用

```javascript
// .luck7rc.js
module.exports = {
  debug: true,
  plugins: {
    router: {
      middleware: '@/middleware/filter',
      index: {
        redirect: '/info/',
        component: '@/layouts/mobile.vue',
        chunk: true
      }
    },
    element: {
      components: ['input', 'checkbox', 'button', 'loading'],
      lang: 'en'
    }
  }
}
```
```javascript
// main.js
import Vue from 'vue'
import Router from 'vue-router'
import {l7Element, l7Router} from 'luck7/plugins'
import login from './routes/login'
import page404 from './routes/404'
import App from './app.vue'

Vue.use(l7Element)
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    login,
    l7Router,
    page404
  ]
})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
```