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
    },
    user: {
      formItem: {
        id: '',
        firstName: '',
        lastName: '',
        userName: '',
        type: ''
      },
      showDialog: false,
      usersLoading: false
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
    SET_USER_LOADING_STATE(state, flag) {
      state.user.usersLoading = flag
    },
    SET_SNACKBAR(state, message) {
      state.snackbar.message = message
      state.snackbar.isActive = true
    },
    TOGGLE_USER_DIALOG(state) {
      state.user.showDialog = !state.user.showDialog
    },
    SET_EDIT_USER_DATA(state, user) {
      state.user.formItem = Object.assign({}, user)
    },
    SET_USER_ADD_OR_EDIT_FORM(state, user) {
      if (user.id !== '') {
        state.user.formItem = Object.assign({}, user)
      }
    },
    CLEAR_USER_FORM_DATA(state) {
      state.user.formItem = {
        id: '',
        firstName: '',
        lastName: '',
        userName: '',
        type: ''
      }
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
    usersLoading: (state) => state.user.usersLoading,
    currentPage: (state) => state.activeDashboardPage,
    isSnackbarActive: (state) => state.snackbar.isActive,
    snackbarMessage: (state) => state.snackbar.message,
    userFormData: (state) => state.user.formItem,
    userFormData_UserId: (state) => state.user.formItem.id,
    showUserForm: (state) => state.user.showDialog
  }
}