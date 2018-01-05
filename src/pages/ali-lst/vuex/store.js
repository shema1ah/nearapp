import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    info: {}
  },
  getters: {
    getInfo: state => {
      return state.info
    }
  },
  mutations: {
    UPDATEINFO (state, info) {
      state.info = info
    },
    UPDATELOCATION(state, location) {
      state.info.province = location.province
      state.info.city = location.city
      state.info.area = location.area
    },
    UPDATESTREET(state, street) {
      state.info.street = street
    }
  }
})

export default store
