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
  {  // diy 配置
    filename: 'message-qa',
    template: 'src/pages/message-qa/index.ejs',  // 指定 html模板路径
    title: '短信营销常见问题'
  },
  {  // diy 配置
   filename: 'voiceBroadcast-qa',
   template: 'src/pages/voiceBroadcast-qa/index.ejs',  // 指定 html模板路径
   title: '播报锦囊' // title 可以在模板中指定,
  },
  {
   filename: 'ali-lst',
   template: 'src/pages/ali-lst/index.ejs',
   title: '阿里零售通'
 },
 {
  filename: 'bill-code',
  template: 'src/pages/bill-code/index.ejs',
  title: '店铺发票打印码'
}, {
 filename: 'writeoff-ticket',
 template: 'src/pages/writeoff-ticket/index.ejs',
 title: '扫码验券'
}
]
