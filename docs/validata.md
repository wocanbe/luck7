# 数据验证插件

基于async-validator，自动挂载到vue空间，不跟UI关联，超轻量

## 使用

```javascript
vue.validator.validate(
  this.detail, // 要验证的数据
  this.detailVali // 验证规则
).then(() => {
  console.log('passed')
}).catch((errs) => {
  console.log('验证错误', errs)
})
```

## 备注
 - 可以指定项目通用验证规则，在luck7rc.js中指定，详见示例
 - 验证的时候验证规则是项目规则和指定规则的并集，若有冲突的地方，以指定规则为准
