import VueRouter from 'vue-router'
import App from './views/index.vue'
import Form from './views/form.vue'
import Local from './views/local.vue'
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
    name: 'form',
    path: '/form',
    component: Form
  },
  {
    name: 'local',  // 中国: 所辖省、直辖市、自治区
    path: '/local',
    component: Local
  },
  {
    name: 'province',  // 省: 所辖城市
    path: '/local/:pid',
    component: Local
  },
  {
    name: 'city',  // 市: 所辖区、县
    path: '/local/:cid',
    component: Local
  },
  {
    name: 'street',  // 区、县: 所辖街道
    path: '/local/:sid',
    component: Local
  }
]
export default new VueRouter({
  routes
})
