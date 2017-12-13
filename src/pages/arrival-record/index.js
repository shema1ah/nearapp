import 'lib-flexible'
import Vue from 'vue'
import VueResource from 'vue-resource'
import FastClick from 'fastclick'
import router from './router.js'
import App from './app.vue'
import '../../filters/index'
import { Toast } from 'qfpay-ui'
window.FastClick = FastClick

Vue.use(VueResource)
// 注册全局组件
Vue.component(Toast.name, Toast)
Vue.prototype.$toast = Toast

// 全局函数
// 获取滚动条当前的位置
Vue.prototype.getScrollTop = function () {
  let scrollTop = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop
  } else if (document.body) {
    scrollTop = document.body.scrollTop
  }
  return scrollTop
}
// 获取当前可视范围的高度
Vue.prototype.getClientHeight = function () {
  let clientHeight = 0
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
  } else {
    clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
  }
  return clientHeight
}
// 获取文档完整的高度
Vue.prototype.getScrollHeight = function () {
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
}
// 将post请求的提交方式默认为formdata形式提交
Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
}

// 在使用cors跨域时带上cookie
Vue.http.options.credentials = true
// 将请求的数据url化
Vue.http.options.emulateJSON = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
