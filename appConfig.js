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
    filename: 'mine',
    template: 'src/pages/mine/index.ejs',  // 指定 html模板路径
    title: '我的测试页面' // title 可以在模板中指定,
  },
  {  // diy 配置
    filename: 'takeout-settings-v20',
    template: 'src/pages/takeout-settings-v20/index.ejs',  // 指定 html模板路径
    title: '外卖设置订单' // title 可以在模板中指定,
  }
]
