import VueRouter from 'vue-router'
import Vue from 'vue'
import InfoConfirm from './views/info-confirm.vue'
import OpenScan from './views/open-scan.vue'
import WriteoffResult from './views/writeoff-result.vue'
import WriteoffFail from './views/writeoff-fail.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/openscan'
  },
  {
    name: 'openscan', // 核销明细页
    path: '/openscan',
    component: OpenScan
  },
  {
    name: 'infoconfirm', // 信息确认页
    path: '/infoconfirm',
    component: InfoConfirm
  },
  {
    name: 'writeoffresuc', // 扫描结果页
    path: '/writeoffresuc',
    component: WriteoffResult
  },
  {
    name: 'writeoffrefail', // 扫描结果页
    path: '/writeoffrefail',
    component: WriteoffFail
  },
]
export default new VueRouter({
  routes
})
