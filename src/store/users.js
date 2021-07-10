import axios from 'axios';
import router from '@/router/index.js'

export default {
  namespaced: true,
  state: () => ({
    allUsers: [],
    user: {
        id: '',
        firstName: '',
        lastName: '',
        userName: '',
        type: ''
    },
    showDialog: false,
    usersLoading: false
  }),
  mutations: {
    SET_USER_LOADING_STATE(state, flag) {
      state.usersLoading = flag
    },
    LOAD_USERS(state, users) {
      state.allUsers = users
    },
    TOGGLE_USER_DIALOG(state) {
      state.showDialog = !state.showDialog
    },
    SET_EDIT_USER_DATA(state, user) {
      state.user = Object.assign({}, user)
    },
    SET_USER_ADD_OR_EDIT_FORM(state, user) {
      if (user.id !== '') {
        state.user = Object.assign({}, user)
      }
    },
    CLEAR_USER_FORM_DATA(state) {
      state.user = {}
    },
  },
  actions: {
    toggleDarkMode({ commit, dispatch, rootGetters }) {
      // since we are only using getters, we can change the flag here
      let user = rootGetters['auth/currentUser']
      user.usesDarkMode = !user.usesDarkMode
      axios({ 
        url: `https://localhost:5001/api/users/${rootGetters['auth/userId']}`, 
        data: user, 
        method: 'PUT', 
        headers: {
         'Authorization': `Bearer ${rootGetters['auth/token']}`,
        }})
        .then(resp => {
          dispatch("ui/showSnackbar", "Saved the dark mode preference to the database", { root: true })
          commit("auth/SET_USER", resp.data, { root: true }) // reset the user for now
        })
        .catch( () => {
          dispatch("ui/showSnackbar", "Unable to save setting to the database", { root: true })
        })
    },
    loadUsers({ commit, rootGetters }) {
      // dispatch('ui/toggleLoadingOverlay', true)
      commit("SET_USER_LOADING_STATE", true)
      axios({ url: `https://localhost:5001/api/users`, method: 'GET', headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
        .then(resp => {
          // here, check those flags and set a userStatus unique to UI
          resp.data.forEach(user => {
            if (rootGetters['auth/userId'] === user.id) {
              user.userStatus = "logged in user"
            } else if (user.isLocked) {
              user.userStatus = "locked"
            } else if (user.needPasswordReset) {
              user.userStatus = "need password reset"
            } else {
              user.userStatus = "enabled"
            }
          })
          commit("SET_USER_LOADING_STATE", false)
          commit("LOAD_USERS", resp.data)
          // dispatch('ui/toggleLoadingOverlay', false)
        })
    },
    loadUserForEdit({ commit, dispatch, rootGetters }, userId) {
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({ url: `https://localhost:5001/api/users/${userId}`, method: 'GET', headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
        .then(resp => {
          commit("SET_EDIT_USER_DATA", resp.data)
          commit("TOGGLE_USER_DIALOG")
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        }) // finish out the catch block
    },
    newUserSubmit({ dispatch, rootGetters }, userData) {
      var newUser = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        type: userData.type,
        userName: userData.userName,
        UsesDarkMode: false,
        password: userData.password
      }
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({ url: `https://localhost:5001/api/users`, method: 'POST', data: newUser, headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
        .then(() => {
          dispatch('ui/showSnackbar', `Successfully added ${userData.userName} to system`, { root: true })
          dispatch('loadUsers')
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
        .catch(error => {
          if (error.response) {
            dispatch('ui/showSnackbar', error.response.data, { root: true })
          }
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
    },
    editUserSubmit({ dispatch, rootGetters }, userData) {
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({
        url: `https://localhost:5001/api/users/${rootGetters['auth/userId']}`,
        data: userData,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${rootGetters['auth/token']}`,
        }
      })
        .then(() => {
          dispatch("ui/showSnackbar", `Successfully edited existing user ${userData.userName} on system`, { root: true })
          dispatch('loadUsers')
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
        .catch(error => {
          if (error.response) {
            dispatch('ui/showSnackbar', error.response.data)
          } else {
            dispatch("ui/showSnackbar", `Unable to apply settings for ${userData.userName} on system`, { root: true })
          }
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
    },
    changeUserPassword({ commit, dispatch, rootGetters }, password) {
      commit("auth/ADD_PASSWORD_TO_USER_FOR_USER_CHANGE", password, { root: true })
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({
        url: `https://localhost:5001/api/users/${rootGetters['auth/userId']}`,
        data: rootGetters['auth/currentUser'],
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${rootGetters['auth/token']}`,
        }
      })
        .then(() => {
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
          dispatch('ui/showSnackbar', "Password reset, you can log in again shortly", { root: true })
          commit('auth/LOGOUT_USER', null, { root: true })
          commit("auth/SET_RESET_PASSWORD_FLAG", true, { root: true })
          router.push({ name: 'Login' })
        })
        .catch(() => {
          dispatch("ui/showSnackbar", "Unable to change password at this time", { root: true })
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
    },
    setLockStatus({ dispatch, rootGetters }, userData) {
      const message = userData.isLocked ? ["locked", "from logging in"] : ["unlocked", "for logging in"]
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({
        url: `https://localhost:5001/api/users/${userData.id}`,
        data: userData,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${rootGetters['auth/token']}`,
        }
      })
        .then(() => {
          dispatch('loadUsers')
          dispatch("ui/showSnackbar", `Successfully ${message[0]} user ${userData.userName} ${message[1]}`, { root: true })
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
        .catch(() => {
          dispatch("ui/showSnackbar", `Unable to apply settings for ${userData.userName} on system`, { root: true })
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
    },
    deleteUser({ dispatch, rootGetters }, userData) {
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({
        url: `https://localhost:5001/api/users/${userData.id}`,
        data: userData.id,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${rootGetters['auth/token']}`,
        }
      })
        .then(() => {
          dispatch('loadUsers')
          dispatch("ui/showSnackbar", `Successfully deleted user ${userData.userName} from the system`, { root: true })
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
        .catch(() => {
          dispatch("ui/showSnackbar", `Unable to delete ${userData.userName} from system`, { root: true })
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
    }
  },
  getters: {
    users: (state) => state.allUsers,
    usersLoading: (state) => state.usersLoading,
    user: (state) => state.user,
    userId: (state) => state.user.id,
    showUserForm: (state) => state.showDialog
  }
}