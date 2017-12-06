import VueRouter from 'vue-router'
import Main from './views/main.vue'
import Detail from './views/detail.vue'
import Particulars from './views/particulars.vue'
import PaymentDetails from './views/payment-details.vue'
import Vue from 'vue'
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
  }
]
export default new VueRouter({
  routes
})
