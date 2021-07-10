export default {
  namespaced: true,
  
  state: () => ({
    activeDashboardPage: '',
    activeReportPage: '',
    overlayActive: false,
    snackbar: {
      isActive: false,
      message: '',
      timeoutInterval: 5 // timeout in seconds to be set
    }
  }),

  mutations: {
    TOGGLE_LOADING_OVERLAY(state, toggle) {
      state.overlayActive = toggle
    },
    CLOSE_SNACKBAR(state) {
      state.snackbar.isActive = false
      state.snackbar.message = ''
    },
    SET_SNACKBAR(state, message) {
      state.snackbar.message = message
      state.snackbar.isActive = true
    },
    SET_ACTIVE_DASHBOARD_PAGE(state, page) {
      state.activeDashboardPage = page
    },
    SET_REPORT_PAGE(state, page) {
      state.activeReportPage = page
    }
  },

  actions: {
    toggleLoadingOverlay({ commit }, toggle) {
      commit('TOGGLE_LOADING_OVERLAY', toggle)
    },
    showSnackbar({ commit, state }, message) {
      commit('SET_SNACKBAR', message)
      setTimeout(() => {
        commit('CLOSE_SNACKBAR')
      }, state.snackbar.timeoutInterval * 1000)
    },
    resetUIforLogout({ commit }) {
      commit('SET_ACTIVE_DASHBOARD_PAGE', '')
      commit('SET_REPORT_PAGE', '')
    }
  },

  getters: {
    currentPage: (state) => state.activeDashboardPage,
    isSnackbarActive: (state) => state.snackbar.isActive,
    snackbarMessage: (state) => state.snackbar.message,
  }
}