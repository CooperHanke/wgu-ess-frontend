import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      isAuthenticated: false
    },
    activeDashboardPage: {
      type: String    }
  },
  mutations: {
    setAuth(state) {
      state.user.isAuthenticated = true
    },
    setActivePage(state, page) {
      state.activeDashboardPage = page
    }
  },
  actions: {
  },
  modules: {
  }
})
