import VueRouter from 'vue-router'
import Coupon from './views/coupon.vue'
import Sale from './views/sale.vue'
import Vue from 'vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/coupon'
  },
  {
    name: 'coupon', // 大湾区 优惠券 兑换码
    path: '/coupon',
    component: Coupon
  },
  {
    name: 'sale', // 渠道 小程序 特卖兑换码
    path: '/sale',
    component: Sale
  }
]
export default new VueRouter({
  routes
})
