import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    settings: {}
  },
  getters: {
    getSettings: state => {
      return state.settings
    }
  },
  mutations: {
    UPDATESETTINGS (state, settings) {
      state.settings = settings
    },
    UPDATESTATUS (state, status) {
      state.settings.delivery_open_state = status
    },
    // 限制配送范围开关
    UPDATELIMITSCOPE (state, status) {
      state.settings.dist_switch = status
    },
    // 更新配送规则
    ADDRULE (state, status) {
      state.settings.rules.push(status)
    },
    UPDATERULE (state, status) {
      let rules = state.settings.rules
      let modifyIndex = rules.findIndex((rule) => {
        return rule.rule_id === status.rule_id
      })
      state.settings.rules[modifyIndex] = status
    },
    UPDATEDIST (state, maxdist) {
      state.settings.max_shipping_dist = maxdist
    },
    UPDATESTARTTIME (state, starttime) {
      state.settings.start_time = starttime
    },
    UPDATEENDTIME (state, endtime) {
      state.settings.end_time = endtime
    },
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
})

export default store
