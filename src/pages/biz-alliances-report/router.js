import VueRouter from 'vue-router'
import App from './views/index.vue'
import List from './views/list.vue'
import Detail from './views/detail.vue'
import Email from './views/email.vue'
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
    path: '/detail/:actvId',
    component: Detail
  },
  {
    name: 'email',
    path: '/email/:actvId',
    component: Email
  }
]
export default new VueRouter({
  routes
})
