import VueRouter from 'vue-router'
import Tablist from './views/Tablist.vue'
import Done from './views/Done.vue'
import MerchntInfo from './views/MerchntInfo.vue'
import StoreInfo from './views/StoreInfo.vue'
import Others from './views/Others.vue'
import Vue from 'vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/tablist'
  },
  {
    path: '/tablist', // 商户信息
    name: 'tablist',
    component: Tablist
  },
  {
    path: '/merchant-info', // 商户信息
    name: 'merchant-info',
    component: MerchntInfo
  },
  {
    path: '/store-info', // 店铺信息
    name: 'store-info',
    component: StoreInfo
  },
  {
    path: '/others', // 其它
    name: 'others',
    component: Others
  },
  {
    name: 'done', // 完成页
    path: '/done',
    component: Done,
  }
]
export default new VueRouter({
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes
})
