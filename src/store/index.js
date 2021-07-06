import Vue from 'vue'
import Vuex from 'vuex'
import appointments from "@/data/appointments.json"; // for local testing
import contacts from "@/data/contacts.json"; // for local testing
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: {
      token: localStorage.getItem('token') || null,
      userId: localStorage.getItem('userId') || null,
      loginFailed: false
    },
    user: {},
    ui: {
      activeDashboardPage: '',
      activeReportPage: '',
      overlayActive: false,
      snackbar: {
        isActive: false,
        message: '',
        timeoutInterval: 3 // timeout in seconds to be set
      },
      user: {
        formItem: {
          id: '',
          firstName: '',
          lastName: '',
          userName: '',
          type: ''
        },
        showDialog: false
      }
    },
    appointment: {
      data: {
        id: -1,
        name: '',
        title: '',
        description: '',
        location: '',
        type: '',
        url: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
      },
      showDialog: false
    },
    appointments: [],
    contact: {
      data: {
        id: -1,
        name: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phoneNumber: ''
      },
      showDialog: false
    },
    contacts: [],
    users: []
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.auth.token = token
      // delete old token, if signing in again, then add it back
      localStorage.removeItem('token')
      localStorage.setItem('token', token)
    },
    SET_USER_ID(state, id) {
      state.auth.userId = id
      localStorage.removeItem('userId')
      localStorage.setItem('userId', id)
    },
    SET_USER(state, user) {
      state.user = user
    },
    TOGGLE_LOADING_OVERLAY(state, toggle) {
      state.ui.overlayActive = toggle
    },
    TOGGLE_LOGIN_FAILED(state, toggle) {
      state.auth.loginFailed = toggle
    },
    CLOSE_SNACKBAR(state) {
      state.ui.snackbar.isActive = false
      state.ui.snackbar.message = ''
    },
    LOAD_USERS(state, users) {
      state.users = users
    },
    SET_SNACKBAR(state, message) {
      state.ui.snackbar.message = message
      state.ui.snackbar.isActive = true
    },
    TOGGLE_USER_DIALOG(state) {
      state.ui.user.showDialog = !state.ui.user.showDialog
    },
    SET_EDIT_USER_DATA(state, user) {
      state.ui.user.formItem = Object.assign({}, user)
    },
    SET_USER_ADD_OR_EDIT_FORM(state, user) {
      if (user.id !== '') {
        state.ui.user.formItem = Object.assign({}, user)
      }
      // state.ui.user.formItem = user
    },
    CLEAR_USER_FORM_DATA(state) {
      state.ui.user.formItem = {
        id: '',
        firstName: '',
        lastName: '',
        userName: '',
        type: ''
      }
    },
    initializeAppointments(state) {
      state.appointments = appointments
    },
    initializeContacts(state) {
      state.contacts = contacts
    },
    setActivePage(state, page) {
      state.ui.activeDashboardPage = page
    },
    setReportPage(state, page) {
      state.ui.activeReportPage = page
    },
    initializeAppointment(state) {
      state.appointment.data = {
        id: -1,
        name: '',
        title: '',
        description: '',
        location: '',
        type: '',
        url: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
      }
    },
    initializeContact(state) {
      state.contact.data = {
        id: -1,
        name: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phoneNumber: ''
      }
    },
    setAppointment(state, payload) {
      state.appointment.data = {
        id: payload.id,
        name: payload.name,
        title: payload.title,
        description: payload.description,
        location: payload.location,
        type: payload.type,
        url: payload.url,
        startTime: payload.startTime,
        startDate: payload.startDate,
        endTime: payload.endTime,
        endDate: payload.endDate
      }
    },
    setAppointmentContact(state, payload) {
      state.appointment.data.name = payload
    },
    setContact(state, payload) {
      state.contact.data = {
        id: payload.id,
        name: payload.name,
        address1: payload.address1,
        address2: payload.address2,
        city: payload.city,
        state: payload.state,
        postalCode: payload.postalCode,
        country: payload.country,
        phoneNumber: payload.phoneNumber
      }
    },
    saveAppointment(state) {
      // in real life, add this to the database, but for now, add it to the collection
      // all appointments must have a contact, and we will use the stored contact
      if (state.appointment.data.id > -1) {
        const index = state.appointments.findIndex(a => a.id === state.appointment.data.id)
        Object.assign(state.appointments[index], state.appointment.data)
      } else if (state.appointment.data.id === -1) {
        const index = state.appointments.length + 1 // in real life, api will detect and control this aspect
        state.appointment.data.id = index
        appointments.push(state.appointment.data)
      }
    },
    deleteAppointment(state) {
      const index = state.appointments.findIndex(a => a.id === state.appointment.data.id)
      state.appointments.splice(index, 1)
      this.commit("initializeAppointment")
    },
    saveContact(state) {
      // in real life, add this to the database, but for now, add it to the collection
      if (state.contact.data.id > -1) {
        const index = state.contacts.findIndex(a => a.id === state.contact.data.id)
        // before making the contact details completely different, make a backup of the existing contact
        const contactBeforeEdit = state.contacts[index].name
        Object.assign(state.contacts[index], state.contact.data)
        // if they are an existing contact, we need to ensure that appointments have the newly updated contact info
        // right now, since we are only tracking for name with layout, use the name and change in entries
        appointments.forEach((appointment, index) => {
          if (appointment.name === contactBeforeEdit) {
            appointments[index].name = state.contact.data.name
          }
        })
        this.commit('updateAppointments')
      } else if (state.contact.data.id === -1) {
        const id = state.contacts.length + 1 // in real life, api will detect and control this aspect
        state.contact.data.id = id
        contacts.push(state.contact.data)
      }
    },
    deleteContact(state) {
      const index = state.contacts.findIndex(c => c.id === state.contact.data.id)
      state.contacts.splice(index, 1)
      let modifiedAppointments = []

      // next, remove all appointments in the UI to do with the deleted contact
      for (const appointment in appointments) {
        if (appointment.name !== state.contact.data.name) {
          modifiedAppointments.push(appointment)
        }
      }

      state.appointments = modifiedAppointments
      // this.commit("updateAppointments")
      this.commit("initializeContact")
    },
    toggleAppointmentDialog(state) {
      state.appointment.showDialog = !state.appointment.showDialog
    },
    toggleContactDialog(state) {
      state.contact.showDialog = !state.contact.showDialog
    },
    updateAppointments(state) {
      state.appointments = appointments
    },
    updateContacts(state) {
      state.contacts = contacts
    },
    LOGOUT_USER(state) {
      state.user = {}
      state.auth.token = null
      state.auth.userId = null
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
    }
  },
  actions: {
    attemptAuth({ commit, dispatch }, credentials) {
      dispatch('toggleLoadingOverlay', true)
      axios({ url: 'https://localhost:5001/api/users/auth', data: credentials, method: 'POST' })
        .then(resp => {
          commit("SET_TOKEN", resp.data.token)
          commit("SET_USER_ID", resp.data.userId)
          dispatch('toggleLoadingOverlay', false)
        })
        .catch(() => {
          dispatch('toggleLoginFailure', true)
          dispatch('toggleLoadingOverlay', false)
        })
    },
    getUserData({ commit, dispatch, state }, userId) {
      dispatch('toggleLoadingOverlay', true)
      axios({ url: `https://localhost:5001/api/users/${userId}`, method: 'GET', headers: { 'Authorization': `Bearer ${state.auth.token}` } })
        .then(resp => {
          commit("SET_USER", resp.data)
          dispatch('toggleLoadingOverlay', false)
      }) // finish out the catch block
    },
    toggleLoginFailure({ commit }, toggle) {
      commit('TOGGLE_LOGIN_FAILED', toggle)
    },
    toggleLoadingOverlay({ commit }, toggle) {
      commit('TOGGLE_LOADING_OVERLAY', toggle)
    },
    showSnackbar({ commit, state }, message) {
      commit('SET_SNACKBAR', message)
      setTimeout(() => {
        commit('CLOSE_SNACKBAR')
      }, state.ui.snackbar.timeoutInterval * 1000)
    },
    toggleDarkMode({ commit, state }) {
      axios({ 
        url: `https://localhost:5001/api/users/${state.user.id}`, 
        data: state.user, 
        method: 'PUT', 
        headers: {
         'Authorization': `Bearer ${state.auth.token}`,
        }})
        .then(resp => {
          commit("SET_SNACKBAR", "Saved the dark mode preference to the database")
          commit("SET_USER", resp.data) // reset the user for now
        })
        .catch( () => {
          commit("SET_SNACKBAR", "Unable to save setting to the database")
        })
    },
    logoutUser({ commit }) {
      commit('LOGOUT_USER')
    },
    loadUsers({ commit, dispatch, state}) {
      dispatch('toggleLoadingOverlay', true)
      axios({ url: `https://localhost:5001/api/users`, method: 'GET', headers: { 'Authorization': `Bearer ${state.auth.token}` } })
      .then(resp => {
        // here, check those flags and set a userStatus unique to UI
        resp.data.forEach(user => {
          if (state.auth.userId === user.id) {
            user.userStatus = "logged in user"
          } else if (user.isLocked) {
            user.userStatus = "locked"
          } else if (user.needPasswordReset) {
            user.userStatus = "need password reset"
          } else {
            user.userStatus = "enabled"
          }
        })
        commit("LOAD_USERS", resp.data)
        dispatch('toggleLoadingOverlay', false)
      })
    },
    loadUserForEdit({ commit, dispatch, state }, userId) {
      dispatch('toggleLoadingOverlay', true)
      axios({ url: `https://localhost:5001/api/users/${userId}`, method: 'GET', headers: { 'Authorization': `Bearer ${state.auth.token}` } })
        .then(resp => {
          commit("SET_EDIT_USER_DATA", resp.data)
          dispatch('toggleLoadingOverlay', false)
      }) // finish out the catch block
    },
    newUserSubmit({ dispatch, state }, userData) {
      var newUser = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        type: userData.type,
        userName: userData.userName,
        UsesDarkMode: false,
        password: userData.password
      }
      dispatch('toggleLoadingOverlay', true)
      axios({ url: `https://localhost:5001/api/users`, method: 'POST', data: newUser, headers: { 'Authorization': `Bearer ${state.auth.token}` } })
      .then(() => {
        dispatch('showSnackbar', `Successfully added ${userData.userName} to system`)
        dispatch('loadUsers')
        dispatch('toggleLoadingOverlay', false)
      })
    }
  },
  modules: {
  },
})