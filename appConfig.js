/**
 * chunks
 * vue vue-resource
 */

// 页面配置
exports.pages = [
  {
    filename: 'takeout-settings',
    template: 'src/pages/takeout-settings/index.ejs',  // 指定 html模板路径
    title: '外卖设置' // title 可以在模板中指定,
  },
  {
    filename: 'patch-information',
    template: 'src/pages/patch-information/index.ejs',
    title: '商户补件'
  },
  {
    filename: 'arrival-record',
    template: 'src/pages/arrival-record/index.ejs',
    title: '账户余额'
  },
  {
    filename: 'ali-lst',
    template: 'src/pages/ali-lst/index.ejs',
    title: '阿里零售通'
  }
]
