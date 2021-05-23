import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      isAuthenticated: false
    }
  },
  mutations: {
    setAuth(state) {
      state.user.isAuthenticated = true
    }
  },
  actions: {
  },
  modules: {
  }
})
