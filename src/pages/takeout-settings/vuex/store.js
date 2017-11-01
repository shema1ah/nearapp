import Vue from 'vue'
import Vuex from 'vuex'

// 告诉 vue “使用” vuex
Vue.use(Vuex)

// 创建一个对象来保存应用启动时的初始状态
const state = {
  settings: {}
  // TODO: 放置初始状态
}

// 创建一个对象存储一系列我们接下来要写的 mutation 函数
const mutations = {
  // mutation 的第一个参数是当前的 state
  // 你可以在函数里修改 state
  UPDATESETTINGS (state, settings) {
    state.settings = settings
  },
  UPDATEDIST (state, maxdist) {
    state.settings.max_shipping_dist = maxdist
  },
  // TODO: 放置我们的状态变更函数
  UPDATESTARTFEE (state, startfee) {
    state.settings.start_delivery_fee = startfee
  },
  UPDATESHIPPINGFEE (state, shippingfee) {
    state.settings.shipping_fee = shippingfee
  },
  UPDATEMINFEE (state, minshippingfee) {
    state.settings.min_shipping_fee = minshippingfee
  }
}

// 整合初始状态和变更函数，我们就得到了我们所需的 store
// 至此，这个 store 就可以连接到我们的应用中
export default new Vuex.Store({
  state,
  mutations
})
