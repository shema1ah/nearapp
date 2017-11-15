import VueRouter from 'vue-router'
import Main from './views/main.vue'
import Vue from 'vue'
import Verify from './views/store-verify.vue'
import Fee from './views/delivery-fee.vue'
import Scope from './views/delivery-scope.vue'
import Amap from './views/amap.vue'
import Autoorder from './views/auto-order.vue'
import DeliveryTimeList from './views/deliverytime-list.vue'
import DeliveryTime from './views/delivery-time.vue'
import DeliveryRegular from './views/delivery-regular.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    name: 'main', // 首页
    path: '/main',
    component: Main
  },
  {
    name: 'verify', // 店铺核实
    path: '/verify',
    component: Verify
  },
  {
    name: 'fee', // 配送费
    path: '/fee',
    component: Fee
  },
  {
    name: 'scope', // 配送规则
    path: '/scope',
    component: Scope
  },
  {
    name: 'map', // 地图组件
    path: '/map',
    component: Amap
  },
  {
    name: 'autoorder',
    path: '/autoorder',
    component: Autoorder
  },
  {
    name: 'deliverytimelist',
    path: '/deliverytimelist',
    component: DeliveryTimeList
  },
  {
    name: 'deliverytime',
    path: '/deliverytime',
    component: DeliveryTime
  },
  {
    name: 'deliveryregular',
    path: '/deliveryregular',
    component: DeliveryRegular
  }
]
export default new VueRouter({
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  // mode: 'out-in',
  routes
})
