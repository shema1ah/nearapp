import VueRouter from 'vue-router'
import App from './views/index.vue'
import List from './views/list.vue'
import Detail from './views/detail.vue'
import Vue from 'vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    name: 'index',
    path: '/index',
    component: App
  },
  {
    name: 'list',
    path: '/list',
    component: List
  },
  {
    name: 'detail',
    path: '/detail',
    component: Detail
  }
]
export default new VueRouter({
  routes
})
