import VueRouter from 'vue-router'
import Main from './views/main.vue'
import Vue from 'vue'
import Verify from './views/store-verify.vue'
import Fee from './views/delivery-fee.vue'
import Scope from './views/delivery-scope.vue'
import Map from './views/mapImg.vue'
Vue.use(VueRouter)

const routes = [
  {
    name: 'main', // 首页
    path: '/',
    component: Main
  },
  {
    name: 'verify', //
    path: '/verify',
    component: Verify
  },
  {
    name: 'fee', //
    path: '/fee',
    component: Fee
  },
  {
    name: 'scope', //
    path: '/scope',
    component: Scope
  },
  {
    name: 'map', //
    path: '/map',
    component: Map
  }
]
export default new VueRouter({
  routes
})
