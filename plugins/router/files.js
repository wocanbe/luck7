const fs = require('fs')
const path = require('path')

const REGEX_VALIDATE_PAGE = /^[$]?[\w-]+$/i // 只支持英文路径
const IGNORES = ['_', '$', '$_', '_$'] // 要跳过不处理的无意义目录及文件
const REGEX_MODULE_INDEX = /^[$]?index$/i

/**
 * 生成文件树
 * @param {String} dirPath 要扫描的目录
 * @param {*} options 附加配置，目前仅支持忽略该目录配置
 */
function readPath (loader, dirPath, options) {
  const result = {
    relatePath: options.relatePath,
    hasFile: false, // 拥有下级文件
    hasDir: false, // 拥有下级目录
    indexFile: '', // 本目录拥有首页
    hasFull: false, // 拥有*路由
    files: [], // 文件列表
    dirs: {} // 目录列表
  }
  const files = fs.readdirSync(dirPath + '/' + options.relatePath)
  const relatePath = options.relatePath ? options.relatePath + '/' : ''
  loader.addContextDependency(path.resolve(dirPath + '/' + options.relatePath + '/'))
  for (const order in files) {
    const fname = files[order]
    if (IGNORES.indexOf(fname) > -1) continue
    if (fname.substr(0, 2) === '__') continue
    const fpath = relatePath + fname
    let stat = fs.statSync(dirPath + '/' + fpath)
    if (stat.isDirectory()) {
      if (options.ignore.includes(fname)) continue
      // 对目录进行处理
      const childFiles = readPath(loader, dirPath, Object.assign({}, options, {relatePath: relatePath + fname}))
      if (childFiles) {
        result.hasDir = true
        result.dirs[fname] = childFiles
      }
    } else {
      if (fname.substr(-4) === '.vue') { // 跳过非vue文件
        const fname2 = fname.replace('.vue', '')
        if (fname2 === '_') {
          result.hasFull = true
          result.hasFile = true
        } else if (IGNORES.indexOf(fname2) > 0) {
          continue // 跳过$.vue、$_.vue和_$.vue
        } else {
          result.hasFile = true
          if (REGEX_MODULE_INDEX.test(fname2)) { // 首页单独处理
            result.indexFile = fname2
          } else if (REGEX_VALIDATE_PAGE.test(fname2)) {
            // 是vue文件，与子路由是平行路由
            result.files.push(fname2)
          }
        }
      }
    }
  }
  if (result.hasFile || result.hasDir) {
    return result
  } else {
    return false
  }
}
// console.log(JSON.stringify(readPath('./src/views', {relatePath: '', ignore: ['assets', 'components']})))

module.exports = readPath
