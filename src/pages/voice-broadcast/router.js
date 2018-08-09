import VueRouter from 'vue-router'
import List from './views/list.vue'
import Detail from './views/detail.vue'
import Vue from 'vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/list'
  },
  {
    name: 'list', // 列表页
    path: '/list',
    component: List
  },
  {
    name: 'detail', // 详情
    path: '/detail',
    component: Detail
  }
]
export default new VueRouter({
  routes
})
