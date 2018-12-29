/**
 * chunks
 * vue vue-resource
 */

// 页面配置
exports.pages = [
  {
    filename: 'voice-broadcast',
    template: 'src/pages/voice-broadcast/index.ejs',  // 指定 html模板路径
    title: '语音播报' // title 可以在模板中指定,
  },
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
    title: '划款记录'
  },
  {  // diy 配置
    filename: 'message-qa',
    template: 'src/pages/message-qa/index.ejs',
    title: '短信营销常见问题'
  },
  {  // diy 配置
    filename: 'voiceBroadcast-qa',
    template: 'src/pages/voiceBroadcast-qa/index.ejs',
    title: '播报锦囊'
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
  },
  {
    filename: 'writeoff-ticket',
    template: 'src/pages/writeoff-ticket/index.ejs',
    title: '核销明细'
  },
  {
    filename: 'biz-alliances-report',
    template: 'src/pages/biz-alliances-report/index.ejs',
    title: '商家联盟活动数据报表'
  },
  {
    filename: 'partner-join',
    template: 'src/pages/partner-join/index.ejs',
    title: '好近支付深圳站招募合伙人'
  },
  {
    filename: 'verify-coupon',
    template: 'src/pages/verify-coupon/index.ejs',
    title: '核销记录'
  },
  {
    filename: 'reset-password',
    template: 'src/pages/reset-password/index.ejs',
    title: '密码重置'
  }
]
