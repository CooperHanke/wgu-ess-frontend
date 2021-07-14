import axios from 'axios';
import router from '@/router/index.js'

export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null,
    loginFailed: false,
    loginFailedMessage: '',
    enablePasswordReset: false,
    loginAttempts: 0,
    resetPasswordDialog: false,
    currentUser: {}
  }),
  mutations: {
    SET_TOKEN(state , token) {
      state.token = token
      // delete old token, if signing in again, then add it back
      localStorage.removeItem('token')
      localStorage.setItem('token', token)
    },
    SET_USER_ID(state, id) {
      state.userId = id
      localStorage.removeItem('userId')
      localStorage.setItem('userId', id)
    },
    SET_USER(state, user) {
      state.currentUser = user
    },
    TOGGLE_LOGIN_FAILED(state, toggle) {
      state.loginFailed = toggle
    },
    INCREMENT_LOGIN_ATTEMPTS_AND_ENABLE_BUTTON(state) {
      state.loginAttempts++
      if (state.loginAttempts >= 3) {
        state.enablePasswordReset = true
      }
    },
    RESET_PASSWORD_BUTTON(state) {
      state.enablePasswordReset = false
      state.loginAttempts = 0
    },
    SET_LOGIN_ERROR_MSG(state, msg) {
      state.loginFailedMessage = msg
    },
    CLEAR_LOGIN_ERRORS(state) {
      state.loginFailedMessage = ''
    },
    OPEN_RESET_BUTTON_DIALOG(state) {
      state.resetPasswordDialog = true
    },
    CLOSE_PASSWORD_RESET_DIALOG(state) {
      state.resetPasswordDialog = false
    },
    LOGOUT_USER(state) {
      state.currentUser = {}
      state.token = null
      state.userId = null
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
    },
    ADD_PASSWORD_TO_USER_FOR_USER_CHANGE(state, password) {
      state.currentUser.password = password
    },
    SET_RESET_PASSWORD_FLAG(state, value) {
      state.currentUser.passwordReset = value
    },
  },
  actions: {
    attemptAuth({ commit, dispatch }, credentials) {
      commit('TOGGLE_LOGIN_FAILED', false)
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({ url: '/users/auth', data: credentials, method: 'POST' })
        .then(resp => {
          commit("CLEAR_LOGIN_ERRORS")
          commit("RESET_PASSWORD_BUTTON")
          commit("SET_TOKEN", resp.data.token)
          commit("SET_USER_ID", resp.data.userId)
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
        .catch(error => {
          commit("INCREMENT_LOGIN_ATTEMPTS_AND_ENABLE_BUTTON")
          if( error.response ){
            commit('SET_LOGIN_ERROR_MSG', error.response.data); // => the response payload 
          }
          dispatch('toggleLoginFailure', true)
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
    },
    getUserData({ commit, dispatch, state }, userId) {
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({ url: `users/${userId}`, method: 'GET', headers: { 'Authorization': `Bearer ${state.token}` } })
        .then(resp => {
          commit("SET_USER", resp.data)
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
      }) // finish out the catch block
    },
    submitPasswordResetRequest({ commit, dispatch }, userData) {
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({ url: '/users/auth/reset', data: userData, method: 'POST' })
        .then( () => {
          commit("CLEAR_LOGIN_ERRORS")
          commit("RESET_PASSWORD_BUTTON")
          commit("CLOSE_PASSWORD_RESET_DIALOG")
          dispatch("ui/toggleLoadingOverlay", false, { root: true })
          dispatch("ui/showSnackbar", "If you have a user account in the system, a manager will be able to reach out to you with a new password", { root: true })
        })
    },
    toggleLoginFailure({ commit }, toggle) {
      commit('TOGGLE_LOGIN_FAILED', toggle)
    },
    logoutUser({ commit, dispatch }) {
      commit('LOGOUT_USER')
      commit('contacts/CLEAR_CONTACTS_ON_LOGOUT', null, { root: true })
      commit('appointments/CLEAR_APPOINTMENTS_ON_LOGOUT', null, { root: true })
      dispatch('ui/resetUIforLogout', null, { root: true })
      router.push({ name: 'Login' })
    },
  },
  getters: {
    userId: (state) => state.userId,
    userType: (state) => state.currentUser.type,
    userName: (state) => state.currentUser.userName,
    firstName: (state) => state.currentUser.firstName,
    lastName: (state) => state.currentUser.lastName,
    usesDarkMode: (state) => state.currentUser.usesDarkMode,
    passwordResetEnabled: (state) => state.enablePasswordReset,
    loginFailed: (state) => state.loginFailed,
    loginFailedMessage: (state) => state.loginFailedMessage,
    token: (state) => state.token,
    currentUser: (state) => state.currentUser,
    resetPasswordDialog: (state) => state.resetPasswordDialog
  }
}