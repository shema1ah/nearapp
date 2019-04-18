import VueRouter from 'vue-router'
import Home from './views/input-fee.vue'
import List from './views/list.vue'
import Detail from './views/detail.vue'
import Predone from './views/pre-done.vue'
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
    component: Home
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
  },
  {
    name: 'predone',
    path: '/predone',
    component: Predone
  }
]

export default new VueRouter({
  routes
})
