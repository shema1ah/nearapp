/**
 * 微信相关
 * Created by aidenZou on 16/6/17.
 */

import config from './config'
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)
Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
}
Vue.http.options.xhr = {
  withCredentials: true
}
Vue.http.options.emulateJSON = true

/* global wx */
const DEBUG = false
const jsApiList = [
  'checkJsApi',
  'hideAllNonBaseMenuItem'
]

exports.init = () => {
  let args = {
    format: 'jsonp',
    url: window.location.href
  }
  Vue.http.jsonp(config.wxmpHost + 'v1/manage/wxjs_conf', args)
    .then((response) => {
      let data = response.data
      if (data.respcd !== config.code.OK) {
        console.error('获取微信分享数据出现错误：', data.respmsg)
        return
      }
      data = data.data
      let wxargs = {
        debug: DEBUG,  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId,  // 必填，公众号的唯一标识
        timestamp: data.timestamp,  // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,  // 必填，签名，见附录1
        jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      }
      wxargs.jsApiList = jsApiList
      data.url = window.location.href
      wx.config(wxargs)
    }, (response) => {
      console.log('获取微信分享数据出现错误：', response)
    })
}

let isReady = false
let actionQueue = []

wx && wx.ready(() => {
  isReady = true
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
  // wx.hideOptionMenu()
  runActionQueue()
})
wx && wx.error((res) => {
  // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
  console.error(res)
})

const runActionQueue = () => {
  for (let index in actionQueue) {
    let actionObj = actionQueue[index]
    /* eslint no-eval: "error" */
    /* eslint-disable no-eval */
    window.eval(actionObj)
  }
  actionQueue = []
}

// 隐藏右上角菜单接口
exports.hideOptionMenu = () => {
  if (!isReady) {
    // actionQueue.push('wx.hideOptionMenu()')
    actionQueue.push('wx.hideAllNonBaseMenuItem()')
    return
  }
  wx.hideOptionMenu()
  // push()
}
