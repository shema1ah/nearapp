import 'lib-flexible'
import Vue from 'vue'
import VueResource from 'vue-resource'
import FastClick from 'fastclick'
import router from './router.js'
import store from './vuex/store.js'
import App from './app.vue'
import { Toast, MessageBox } from 'qfpay-ui'
import '../../filters/index'
window.FastClick = FastClick

Vue.use(VueResource)
// 注册全局组件
Vue.component(Toast.name, Toast)
Vue.prototype.$toast = Toast
Vue.component(MessageBox.name, MessageBox)
Vue.prototype.$messagebox = MessageBox

Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
}
Vue.http.options.xhr = {
  withCredentials: true
}
Vue.http.options.emulateJSON = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
