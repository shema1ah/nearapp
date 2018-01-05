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
    name: 'update',   // 更新信息，不需要直接跳 零售通
    path: '/update',
    component: Form
  },
  {
    name: 'local',  // 中国: 所辖省、直辖市、自治区
    path: '/local',
    component: Local
  }
]
export default new VueRouter({
  routes
})
