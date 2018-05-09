import VueRouter from 'vue-router'
import Balance from './views/balance.vue'
import OuterDetail from './views/outer-detail.vue'
import Account from './views/account.vue'
import EntryDetail from './views/entry-detail.vue'
import Fqa from './views/fqa.vue'
import Shoplist from './views/shoplist.vue'
import Question from './views/question.vue'
import Vue from 'vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/balance'
  },
  {
    name: 'balance', // 首页
    path: '/balance',
    component: Balance
  },
  {
    name: 'outerDetail', // 详情
    path: '/outerDetail/:biz_sn',
    component: OuterDetail
  },
  {
    name: 'account', // 明细
    path: '/account',
    component: Account
  },
  {
    name: 'entryDetail', // 收款详情
    path: '/entryDetail',
    component: EntryDetail
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
  },
  {
    name: 'question',
    path: '/question',
    component: Question
  }
]
export default new VueRouter({
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes
})
