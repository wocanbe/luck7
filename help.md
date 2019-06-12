# luck7
一个框架加载的loader
## 说明
读取``.luck7rc.js``文件的配置并进行注册

## 内部插件

位于plugins目录，插件名为目录名的驼峰写法

## 外部插件

位于node_modules包，包中存在``luck7/install.js``文件，插件名为包名的驼峰写法

## 插件规则

插件导出对象可以支持``libs``, ``utils``, ``define``,``config``,``install``5个配置

## libs和utils

  要引入的文件，原封不动的输出。字符串类型数组。``libs``一般来自第三方库，``utils``一般来自项目公用代码。

## define

  来自插件的通用代码，原封不动的输出。字符串类型

  在``config``加载前载入，可以处理``config``中依赖的库和方法。重要的内容放在这

  建议``defines``中尽量不要出现``import``,``require``等引入文件的语句

## install: 要执行的代码

   会自动加入处理后的``config``(替换``${config}``关键词)

## config

  插件配置，框架核心，对象类型。

### config的几种特殊写法

  - var: 变量名称

   变量需要在``common``中提前定义好，示例如下

   ``key1|var: 'val1'``: 结果``key1: val1``

   ``['val1|var', 'val2']``，结果``[val1, 'val2']``

  - link: 文件依赖，通过require方式引入

   ``key1|link: 'val1'``: 结果``const _2d2abe26 = require('val1')``,``key1: _2d2abe26``

   ``['val1|link']``: 结果``const _2d2abe26 = require('val1')``,``[_2d2abe26]``

  - require: 文件依赖，通过require方式引入

   ``key1|require: 'val1'``: 结果````key1: require('val1')``

   ``['val1|require']``: 结果``[require('val1')]``

  - filelink: 文件依赖，通过import方式引入
   
   结果分为两部分: files和code, files部分会计算并去除重复引入
  
   ``key1|filelink: 'val1'``: 结果``import _2d2abe26 from 'val1'``,``key1: _2d2abe26``
   
   ``['val1|filelink']``: 结果``import _2d2abe26 from 'val1'``,``[_2d2abe26]``

  - asynclink: 文件依赖，通过import方式异步引入
   
   结果分为两部分: files和code, files部分会计算并去除重复引入,该方式chunkName可以不写
  
   ``key1|asynclink: 'val1'``: 结果``const _2d2abe26 = () => import('val1')``,``key1: _2d2abe26``

   ``key1|asynclink: 'val1!chunkName'``: 结果``const _2d2abe26 = () => import(/* webpackChunkName: "chunkName" */ 'val1')``,``key1: _2d2abe26``

   ``['val1!chunkName|asynclink']``: 结果``const _2d2abe26 = () => import(/* webpackChunkName: "chunkName" */ 'val1')``,``[_2d2abe26]``

  - fun: 方法
   
   使用指定的方法处理值，方法需要在``config``中提前定义。
  
   可以跟其他几个配合使用，优先级最高，只能放在最后。

   只支持一个参数，多个参数请写成数组

   ``key1!fun1|fun: 'val1'``: 结果``key1:fun1('val1')``
  
   ``['val1!fun1|fun']``: 结果``[fun1('val1')]``
   
   ``key1!fun2[]|fun: ['val1','val2']``: 结果``key1: [fun2('val1'), fun2('val2')]``

   ``key1|filelink!fun1|fun: 'val1'``: 结果``import _2d2abe26 from 'val1'``,``key1: fun1(_2d2abe26)``

## 其他

  框架内部自动生成代码

  导出各个插件定义的对象，各插件的导出对象应在插件中定义好，可以在defines或installs中定义，一般在installs中定义，
  导出对象的名字为插件路径对应的驼峰写法，如``element``插件，要生成``l7Element``对象

  生成代码示例
  
  一块输出: ``export {l7Router, l7Element}``

  单独输出(target): ``export default l7Router``

## 注意

1、一定要创建导出对象，如``element``插件，一定要创建``l7Element``对象
2、为了规范代码以及防止eslint报错，link、filelink、asynclink引入了防重复引入机制，对同一个路径，三种引入方式只能有一个生效(最早写的生效)。
3、在Object类型中，fun中的funName与asynclink的chunkName，它们的书写位置不一样，一个写在value中，一个写在key中