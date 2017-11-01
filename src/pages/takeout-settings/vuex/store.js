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
      console.log('UPDATESETTINGS')
      console.log(settings)
      state.settings = settings
    },
    UPDATEDIST (state, maxdist) {
      state.settings.max_shipping_dist = maxdist
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
