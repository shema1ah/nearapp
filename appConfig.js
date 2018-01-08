/**
 * Created by aidenZou on 16/5/6.
 */

/**
 * chunks
 * vue vue-resource
 */

// 页面配置
exports.pages = [
  {  // diy 配置
    filename: 'takeout-settings',
    template: 'src/pages/takeout-settings/index.ejs',  // 指定 html模板路径
    title: '外卖设置' // title 可以在模板中指定,
  },
  {  // diy 配置
    filename: 'patch-information',
    template: 'src/pages/patch-information/index.ejs',  // 指定 html模板路径
    title: '商户补件' // title 可以在模板中指定,
  },
  {  // diy 配置
   filename: 'arrival-record',
   template: 'src/pages/arrival-record/index.ejs',  // 指定 html模板路径
   title: '账户余额' // title 可以在模板中指定,
 },
 {  // diy 配置
    filename: 'message-qa',
    template: 'src/pages/message-qa/index.ejs',  // 指定 html模板路径
    title: '账户余额' // title 可以在模板中指定,
  },
  {  // diy 配置
   filename: 'voiceBroadcast-qa',
   template: 'src/pages/voiceBroadcast-qa/index.ejs',  // 指定 html模板路径
   title: '账户余额' // title 可以在模板中指定,
  }
]
