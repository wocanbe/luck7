# luck7

一个自动生成代码的框架，可以通过命令行使用，也可以通过webpack来加载

## 配置文件

默认为``.luck7rc.js``,通过命令行使用的时候可以通过``-f``指定配置文件

```javascript
// 配置文件示例
module.exports = {
  debug: true,
  plugins: {
    vueRouter: {
      target: 'src/router/auto.js',
      index: {
        redirect: '/welcome/',
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
 - target

  每个插件都支持``target``。用来标识并制定该插件代码保存的文件，``target``的值可以是绝对路径或者相对路径，不支持``webpackConfig.resolve.alias``中的配置。

  指定保存文件后，该插件的代码不会再注入全局代码

## 命令行使用
  ```bash
  luck7 [targetFile] [-c <configFile>]
  ```

  - configFile

  配置文件，默认`./.luck7rc.js`

  - targetFile

  要生成的文件，生成的代码将保存到该文件。可以不指定，在配置文件中分别为各个插件制定不同的文件

  示例

```json
// package.json部分代码
{
  "scripts": {
    "generator": "luck7 src/generator.js"
  },
}
```
```bash
npm run generator
```
```javascript
// src/main.js
import Vue from 'vue'
import Router from 'vue-router'
import {l7Element} from './generator'
import l7VueRouter from './router/auto'
import App from './App'
import store from './store'

Vue.config.productionTip = false
Vue.use(Router)
Vue.use(l7Element)

const router = new Router({
  routes: [l7VueRouter]
})
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
```
## 配合webpack使用

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
项目代码
```javascript
// main.js
import Vue from 'vue'
import Router from 'vue-router'
import {l7Element, l7VueRouter} from 'luck7/plugins'
import login from './routes/login'
import page404 from './routes/404'
import App from './app.vue'

Vue.use(l7Element)
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    login,
    l7VueRouter,
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