# luck7
一个框架加载的loader
## 说明
读取``.luck7rc.js``文件的配置并进行注册

## 内部插件

位于plugins目录，插件名为目录名的驼峰写法

## 外部插件

位于node_modules包，包中存在``luck7/install.js``文件，插件名为包名的驼峰写法

## 插件规则示例

插件导出对象可以支持``libs``,``common``,``define``,``config``,``install``5个配置描述

 - libs

  要引入的文件，一般来自第三方库，原封不动的输出。字符串类型数组

 - common

  来自插件的通用代码，原封不动的输出。字符串类型

  在``config``加载前载入，可以处理``config``中依赖的库和方法。不太重要的内容不要放在这


 - defines

  来自插件的一般代码，原封不动的输出，重要性较public低，在``config``加载后，``install``加载前加载
 - config

  插件配置，对象类型。

  config的几种特殊写法

   - var: 变量名称

   变量需要在``common``中提前定义好，示例如下

   ``key1|var: 'val1'``: 结果``key1: val1``

   ``['val1|var', 'val2']``，结果``[val1, 'val2']``

   - require: 文件依赖，通过require方式引入

   ``key1|require: 'val1'``: 结果````key1: require('val1')``

   ``['value1|require']``: 结果``[require('val1')]``

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

// files from plugins config
要引入的文件，来自plugins的config中的require/filelink/asynclink

   - installs: 要执行的代码

   会自动加入处理后的config(替换``${config}``关键词)

   其他: 框架内部自动生成代码

   对应代码应在install中定义
   
   根据插件路径自动转化为驼峰写法，插件导出内容(如l7Ui变量)需在defines或installs中定义

  ``export {l7Router, l7Element}``


注意
1、在Object类型中，fun中的funName与asynclink的chunkName，它们的书写位置不一样，一个写在value中，一个写在key中