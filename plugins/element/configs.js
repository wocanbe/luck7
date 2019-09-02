const components = [
  'pagination',
  'dialog',
  'autocomplete',
  'dropdown',
  'dropdownMenu',
  'dropdownItem',
  'menu',
  'submenu',
  'menuItem',
  'menuItemGroup',
  'input',
  'inputNumber',
  'radio',
  'radioGroup',
  'radioButton',
  'checkbox',
  'checkboxButton',
  'checkboxGroup',
  'switch',
  'select',
  'option',
  'optionGroup',
  'button',
  'buttonGroup',
  'table',
  'tableColumn',
  'datePicker',
  'timeSelect',
  'timePicker',
  'popover',
  'tooltip',
  'breadcrumb',
  'breadcrumbItem',
  'form',
  'formItem',
  'tabs',
  'tabPane',
  'tag',
  'tree',
  'alert',
  'slider',
  'icon',
  'row',
  'col',
  'upload',
  'progress',
  'spinner',
  'badge',
  'card',
  'rate',
  'steps',
  'step',
  'carousel',
  'scrollbar',
  'carouselItem',
  'collapse',
  'collapseItem',
  'cascader',
  'colorPicker',
  'transfer',
  'container',
  'header',
  'aside',
  'main',
  'footer',
  'timeline',
  'timelineItem',
  'infiniteScroll',
  'link',
  'divider',
  'image',
  'calendar',
  'backtop',
  'pageHeader',
  'cascaderPanel',
  'avatar',
  'drawer'
]

const specialComponents = {
  // infiniteScroll: ['infiniteScroll', 'infiniteScroll'],
  collapseTransition: ['transitions/collapse-transition', '']
}
// components.sort()
const globalComponents = [
  // 以下四个组件不需要注册为Ui组件
  'loading', 'notification', 'messageBox', 'message'
]
const directive = {
  'loading': 'directive'
}
const global = {
  'loading': {
    loading: 'service'
  },
  'messageBox': {
    msgbox: 'default',
    alert: 'alert',
    confirm: 'confirm',
    prompt: 'prompt'
  },
  'notification': {
    notify: 'default'
  },
  'message': {
    message: 'default'
  }
}
const lang = [
  'zh-CN', // 简体中文
  'en', // 英语
  'de', // 德语
  'pt', // 葡萄牙语
  'es', // 西班牙语
  'da', // 丹麦语
  'fr', // 法语
  'nb-NO', // 挪威语
  'zh-TW', // 繁体中文
  'it', // 意大利语
  'ko', // 韩语
  'ja', // 日语
  'nl', // 荷兰语
  'vi', // 越南语
  'ru-RU', // 俄语
  'tr-TR', // 土耳其语
  'pt-br', // 巴西葡萄牙语
  'fa', // 波斯语
  'th', // 泰语
  'id', // 印尼语
  'bg', // 保加利亚语
  'pl', // 波兰语
  'fi', // 芬兰语
  'sv-SE', // 瑞典语
  'el', // 希腊语
  'sk', // 斯洛伐克语
  'ca', // 加泰罗尼亚语
  'cs-CZ', // 捷克语
  'ua', // 乌克兰语
  'tk', // 土库曼语
  'ta', // 泰米尔语
  'lv', // 拉脱维亚语
  'af-ZA', // 南非荷兰语
  'ee', // 爱沙尼亚语
  'sl', // 斯洛文尼亚语
  'ar', // 阿拉伯语
  'he', // 希伯来语
  'lt', // 立陶宛语
  'mn', // 蒙古语
  'kz', // 哈萨克斯坦语
  'hu', // 匈牙利语
  'ro', // 罗马尼亚语
  'ku', // 库尔德语
  'ug-CN', // 维吾尔语
  'km', // 高棉语
  'sr', // 塞尔维亚语
  'eu', // 巴斯克语
  'kg', // 吉尔吉斯语
  'hy', // 亚美尼亚语
  'hr', // 克罗地亚
  'eo' // 世界语
]

module.exports = {
  components,
  specialComponents,
  globalComponents,
  directive,
  global,
  lang: lang.map(v => v.toLowerCase())
}
