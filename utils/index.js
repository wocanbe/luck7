function camel2hyphen (str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function hyphen2camel (str) {
  return str.replace(/-(\w)/g, function ($0, $1) {
    // console.log(arguments);
    return $1.toUpperCase()
  })
}
module.exports = {camel2hyphen, hyphen2camel}
