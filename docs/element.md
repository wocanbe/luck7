# element-ui加载工具

只需要配置要使用的组件，自动加载所需组件以及样式。

## 支持的配置项

 - components Array

 要使用的组件列表,必填

 - lang string

 要使用的语言，采用element国际化的第二个示例的实现方式

 - i18n string

 使用i18n方法，内部采用element-ui里面的``按需加载里定制 i18n``的实现方式，该参数是一个js文件路径,推荐使用类似``@/i18n``的alia写法，该文件返回处理后的i18n对象

 - theme string

 使用皮肤变量，要有``element-theme-chalk``包才会生效，否则会忽略该参数，该参数指向一个scss文件路径
