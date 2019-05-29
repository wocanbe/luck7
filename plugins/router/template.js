const str1 = `const defaultRouter = {template: '<router-view></router-view>'}`
const str2 = `
function l7RouteFilter (route) {
  if (route[1]) {
    let otherInfo
    if (isFunction(routeFilter)) otherInfo = routeFilter(l7RouteRoot+route[1])
    else if (isObject(routeFilter)) otherInfo = routeFilter[l7RouteRoot+route[1]]
    else return route[0]
    if(otherInfo.name) route[0].name=otherInfo.name
    return extend(otherInfo,route[0])
  }
  return route[0]
}`
module.exports = function (rootPath, middleware) {
  let str = str1 + `\nconst l7RouteRoot='${rootPath}'`
  if (middleware) {
    str += `\nimport routeFilter from '${middleware}'`
    str += str2
  }
  return str
}
