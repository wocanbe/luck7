const _ = require('lodash')
const hash = require('hash-sum')

let dependents = []

function addDependent (path) {
  const hashName = '_' + hash(path)
  const depCode = `import ${hashName} from '${path}'`
  if (!dependents.includes(depCode)) dependents.push(depCode)
  return hashName
}
function addAsyncDep (path) {
  const af = path.split('!')
  const hashName = '_' + hash(af[0])
  let depCode
  if (af.length === 1) depCode = `const ${hashName} = () => import('${af[0]}')`
  else depCode = `const ${hashName} = () => import(/* webpackChunkName: "${af[1]}" */ '${af[0]}')`
  if (!dependents.includes(depCode)) dependents.push(depCode)
  return hashName
}

function compileObj (obj) {
  let backStr = '{'
  let objOrder = 0
  for (let k in obj) {
    const lConfig = obj[k]
    if (lConfig === undefined || lConfig === null) continue // 跳过空白对象如undefined, null等
    let funName, importType, key, value
    let arrFun = false
    if (k.substr(-4) === '|fun') {
      const startFun = k.lastIndexOf('!')
      funName = k.slice(startFun + 1, -4)
      if (funName.indexOf('[]') > 0) {
        funName = funName.replace('[]', '')
        arrFun = true
      }
      k = k.substr(0, startFun)
    }
    if (k.substr(-4) === '|var') {
      key = k.substr(0, k.length - 4)
      importType = 'v'
    } else if (k.substr(-8) === '|require') {
      key = k.substr(0, k.length - 8)
      importType = 'r'
    } else if (k.substr(-9) === '|filelink') {
      key = k.substr(0, k.length - 9)
      importType = 'f'
    } else if (k.substr(-10) === '|asynclink') {
      key = k.substr(0, k.length - 10)
      importType = 'a'
    } else {
      key = k
    }
    if (_.isString(lConfig)) {
      if (importType === 'v') {
        value = lConfig
      } else if (importType === 'r') {
        value = `require('${lConfig}')`
      } else if (importType === 'f') {
        value = addDependent(lConfig)
      } else if (importType === 'a') {
        value = addAsyncDep(lConfig)
      } else {
        value = `'${lConfig}'`
      }
    } else if (_.isRegExp(lConfig)) {
      value = lConfig
    } else if (_.isFunction(lConfig)) {
      value = lConfig()
    } else if (_.isArray(lConfig)) {
      if (arrFun) value = compileArr(lConfig, funName)
      else value = compileArr(lConfig)
    } else if (_.isObject(lConfig)) { // arrays, functions, objects, regexes,new Number(0), 以及 new String(\'\')
      value = compileObj(lConfig)
    } else { // 其他类型直接使用，如number,boolean
      value = lConfig
    }
    if (objOrder > 0) backStr += ', '
    objOrder++
    if (funName && !arrFun) backStr += `${key}: ${funName}(${value})`
    else backStr += `${key}: ${value}`
  }
  backStr += '}'
  return backStr
}
function compileArr (arrs, arrFun) {
  let backStr = '['
  let arrOrder = 0
  for (const arrItem of arrs) {
    if (arrOrder > 0) backStr += ', '
    arrOrder++
    let arrVal = ''
    if (_.isString(arrItem)) {
      let funName
      if (arrItem.substr(-4) === '|fun') {
        const startFun = arrItem.lastIndexOf('!')
        funName = arrItem.slice(startFun + 1, -4)
        arrItem = arrItem.substr(0, startFun)
        arrVal = `${funName}(` 
      }
      if (arrItem.substr(-4) === '|var') {
        arrVal += arrItem.substr(0, arrItem.length - 4)
      } else if (arrItem.substr(-8) === '|require') {
        arrVal += `require('${arrItem.substr(0, arrItem.length - 8)}')`
      } else if (arrItem.substr(-9) === '|filelink') {
        arrVal += `${addDependent(arrItem.substr(0, arrItem.length - 9))}`
      } else if (arrItem.substr(-10) === '|asynclink') {
        arrVal += `${addAsyncDep(arrItem.substr(0, arrItem.length - 10))}`
      } else {
        arrVal += `'${arrItem}'`
      }
      if (funName) arrVal += ')' 
    } else if (_.isRegExp(arrItem)) {
      arrVal = arrItem
    } else if (_.isFunction(arrItem)) {
      arrVal = arrItem()
    } else if (_.isArray(arrItem)) {
      arrVal = compileArr(arrItem)
    } else if (_.isObject(arrItem)) {
      arrVal = compileObj(arrItem)
    } else { // 其他类型直接使用，如number,boolean,undefined,null
      arrVal = arrItem
    }

    if (arrFun) backStr += arrFun + '(' + arrVal + ')'
    else backStr += arrVal
  }
  backStr += ']'
  return backStr
}
function compileConfig (config) {
  if (_.isArray(config)) {
    return compileArr(config)
  } else {
    return compileObj(config)
  }
}

function compile(options) {
  dependents = []
  let installStr = ''
  for (let i = 0; i < options.installs.length; i++) {
    const install = options.installs[i]
    const config = options.configs[i]
    // eslint-disable-next-line
    installStr += install.replace('${config}', compileConfig(config)) + '\n'
  }

  let backStr = '// libs\n'
  backStr += options.libs.join('\n')
  backStr += '\n// commons\n'
  backStr += options.common.join('\n')
  backStr += '\n// files\n'
  backStr += dependents.join('\n')
  backStr += '\n// defines\n'
  backStr += options.defines.join('\n')
  backStr += '\n// installs\n'
  backStr += installStr
  return backStr
}
module.exports = compile
