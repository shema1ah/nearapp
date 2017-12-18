import VueRouter from 'vue-router'
import Main from './views/main.vue'
import Detail from './views/detail.vue'
import Particulars from './views/particulars.vue'
import PaymentDetails from './views/payment-details.vue'
import Fqa from './views/fqa.vue'
import Shoplist from './views/shoplist.vue'
import Vue from 'vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/shoplist'
  },
  {
    name: 'main', // 首页
    path: '/main',
    component: Main
  },
  {
    name: 'detail', // 详情
    path: '/detail',
    component: Detail
  },
  {
    name: 'particulars', // 明细
    path: '/particulars',
    component: Particulars
  },
  {
    name: 'paymentDetails', // 收款详情
    path: '/paymentDetails',
    component: PaymentDetails
  },
  {
    name: 'fqa',
    path: '/fqa',
    component: Fqa
  },
  {
    name: 'shoplist',
    path: '/shoplist',
    component: Shoplist
  }
]
export default new VueRouter({
  // scrollBehavior () {
  //   return { x: 0, y: 0 }
  // },
  routes
})
