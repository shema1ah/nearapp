import 'lib-flexible'
import Vue from 'vue'
import VueResource from 'vue-resource'
import FastClick from 'fastclick'
import router from './router.js'
import App from './main.vue'
import '../../filters/index'
import { Toast, Indicator } from 'qfpay-ui'
window.FastClick = FastClick
Vue.use(VueResource)

Vue.prototype.$toast = Toast
Vue.prototype.$Indicator = Indicator
Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
}
Vue.http.options.credentials = true
Vue.http.options.emulateJSON = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
