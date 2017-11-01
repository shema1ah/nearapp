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
