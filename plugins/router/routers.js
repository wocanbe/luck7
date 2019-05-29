// const loaderUtils = require('loader-utils')
const hash = require('hash-sum')

function getFileRoute (dirPath, file, options) {
  let routePath = file.replace('$', '')
  // const component = loaderUtils.stringifyRequest(dirPath + options.relatePath + '/' + file + '.vue')
  let relatePath = options.relatePath ? options.relatePath + '/' : ''
  const component = dirPath + '/' + relatePath + file + '.vue'
  let chunkName = options.chunkName
  if (file.slice(0, 1) === '$') chunkName = hash(relatePath + routePath) // 在更改routePath前生成，防止$index.vue跟父路由打包在一块
  let fullpath, routeName
  if (routePath === '_') {
    routePath = '*'
  }
  if (routePath.substr(0, 1) === '_') { // 带参数路由
    routePath = routePath.replace('_', ':')
  }
  relatePath = relatePath.replace(/\$/g, '')
  if (routePath === 'index') { // 首页路由 options.prefixPath === ''代表新的子目录
    fullpath = relatePath
    if (relatePath.slice(-1) === '/') relatePath = relatePath.slice(0, -1)
    routePath = ''
    if (routePath.slice(-1) === '/') routePath = routePath.slice(0, -1)
  } else { // 一般路由
    fullpath = relatePath + routePath
  }
  let backRes = []
  routeName = fullpath.replace(/\//g, '-').replace(/\:/g, '')
  if (routeName.slice(-1) === '-') routeName = routeName.slice(0, -1)
  const backRoute = {
    name: routeName,
    path: routePath
  }
  if (chunkName) {
    // if (chunkName === true) backRoute['component|asynclink'] = component // 不chunkName，只进行异步引入
    backRoute['component|asynclink'] = component + '!' + chunkName
  } else {
    backRoute['component|filelink'] = component
  }
  backRes.push(backRoute)
  backRes.push(fullpath)
  return backRes
}
function getRouteConfig (dirPath, options, middleware) {
  const {files, dirs, indexFile, hasFull} = options
  const prefixPath = options.prefixPath ? options.prefixPath + '/' : ''
  const relatePath = options.relatePath ? options.relatePath + '/' : ''
  let routes = []
  let childrenName = 'children'
  if (middleware) childrenName += '!l7RouteFilter[]|fun'

  if (indexFile) {
    const indexRoute = getFileRoute(dirPath, indexFile, Object.assign(options, {prefixPath}))
    if (middleware) {
      // indexRoute[1] = '' // 首页不进行路由权限检查
      routes.push(indexRoute)
    } else routes.push(indexRoute[0])
  }
  for (var file of files) {
    let routePath = file.replace('$', '')
    let asyncPath = '$' + routePath
    const cmpRoutes = getFileRoute(dirPath, file, Object.assign(options, {prefixPath}))

    let chunkName = options.chunkName
    let parentAsync = false
    if (file.slice(0, 1) === '$') {
      chunkName = hash(relatePath + routePath) // 如果父路由是异步的，子路由也是异步的
      parentAsync = true
    }
    if (dirs[routePath]) { // 存在子路由
      const childRoutes = getRouteConfig(dirPath, Object.assign(dirs[routePath], {prefixPath: '', chunkName}), middleware)
      if (dirs[routePath].indexFile) delete cmpRoutes[0].name // 防止路由报错，删掉有子路由的父路由name
      cmpRoutes[0][childrenName] = childRoutes
    } else if (dirs[asyncPath]) { // 存在异步子路由
      if (!parentAsync) chunkName = hash(relatePath + routePath) // 如果父路由不是异步的，异步子路由再次创建chunkName
      const childRoutes = getRouteConfig(dirPath, Object.assign(dirs[asyncPath], {prefixPath: '', chunkName}), middleware)
      if (dirs[asyncPath].indexFile) delete cmpRoutes[0].name
      cmpRoutes[0][childrenName] = childRoutes
    }
    if (middleware) routes.push(cmpRoutes)
    else routes.push(cmpRoutes[0])
  }

  for (var path in dirs) {
    let routePath = path.replace('$', '')
    if (files.includes(routePath)) continue // 跳过存在同名父路由的目录
    if (files.includes('$' + routePath)) continue // 跳过存在同名异步父路由的目录
    if (routePath.substr(0, 1) === '_') {
      routePath = routePath.replace('_', ':')
    }
    let fullpath = relatePath + routePath
    let dirRouter = {
      path: routePath,
      name: fullpath.replace(/\//g, '-').replace(/\:/g, '').replace('*', 'full'),
      'component|var': 'defaultRouter'
    }
    if (dirs[path].indexFile) delete dirRouter.name
    let chunkName = options.chunkName
    const dirPrefix = prefixPath + routePath
    if (path.slice(0, 1) === '$') {
      chunkName = hash(relatePath + routePath)
      dirRouter[childrenName] = getRouteConfig(dirPath, Object.assign(dirs[path], {prefixPath: dirPrefix, chunkName}), middleware)
    } else {
      dirRouter[childrenName] = getRouteConfig(dirPath, Object.assign(dirs[path], {prefixPath: dirPrefix, chunkName}), middleware)
    }
    if (middleware) routes.push([dirRouter, fullpath])
    else routes.push(dirRouter)
  }
  if (hasFull) {
    const fullRoute = getFileRoute(dirPath, '_', Object.assign(options, {prefixPath}))
    fullRoute[0].name = fullRoute[0].name.replace('*', 'full')
    if (middleware) routes.push(fullRoute)
    else routes.push(fullRoute[0])
  }
  return routes
}

module.exports = getRouteConfig
