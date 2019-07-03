import 'lib-flexible'
import Vue from 'vue'
import VueResource from 'vue-resource'
import FastClick from 'fastclick'
import router from './router.js'
import App from './App.vue'
import { Tab, Tabs, Popup, Picker, DatetimePicker, Toast, Field, Icon, Dialog } from 'vant'
import '../../filters/index'
window.FastClick = FastClick

Vue.use(VueResource)

Vue.use(Tab).use(Tabs).use(Popup).use(Picker).use(DatetimePicker).use(Toast).use(Field).use(Icon).use(Dialog)

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
