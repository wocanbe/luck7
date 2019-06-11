// const path = require('path')
const isArray = require('lodash/isArray')
const isString = require('lodash/isString')
const readPath = require('./files')
const creatRouters = require('./routers')
const template = require('./template')

function creatRootRouter (loader, options) {
  const filePath = options.filePath || ['src/views', '@/views']
  let ignore = ['assets', 'components'] // 要排除的目录名字
  if (isArray(options.ignore)) {
    ignore = ignore.concat(options.ignore)
  }
  const libs = []
  // 读取目录
  const files = readPath(loader, filePath[0], {ignore, relatePath: ''})
  if (files === false) {
    return Promise.reject(new Error('入口目录不能为空！'))
  }

  // 根路由的子节点名称，用于标记需不需要使用middleware处理
  let childrenName = 'children'
  // 处理额外路由信息的公用代码
  if (options.middleware) {
    childrenName = 'children!l7RouteFilter[]|fun'
    libs.push('import extend from \'lodash/extend\'')
    libs.push('import isFunction from \'lodash/isFunction\'')
    libs.push('import isObject from \'lodash/isObject\'')
  }

  let routerConfig = {
    path: '',
    component: undefined
  }
  // 处理路由树的根节点
  if (options.index) {
    const indexCmp = options.index.component
    // loader.addContextDependency(path.resolve(options.index[0]))
    routerConfig = Object.assign(options.index, routerConfig)
    if (isString(indexCmp)) routerConfig['component|filelink'] = indexCmp
    else routerConfig['component|var'] = 'defaultRouter'
  } else {
    routerConfig['component|var'] = 'defaultRouter'
  }

  // 生成路由元数据
  routerConfig[childrenName] = creatRouters(filePath[1], files, options.middleware)

  const common = template(options.rootPath || '/', options.middleware)

  const result = {
    libs,
    common,
    config: routerConfig,
    // eslint-disable-next-line
    install: 'const l7VueRouter = ${config}'
  }
  const targetFile = options.target
  if (targetFile) result['target'] = targetFile

  return Promise.resolve(result)
}
module.exports = creatRootRouter
