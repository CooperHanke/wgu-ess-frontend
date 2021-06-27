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
      userId: localStorage.getItem('userId') || null
    },
    user: {},
    activeDashboardPage: '',
    activeReportPage: '',
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
    contacts: []
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.auth.token = token
      localStorage.setItem('token', token)
    },
    SET_USER(state, user) {
      state.user = user
      localStorage.setItem('lastUserId', user.id)
    },
    initializeAppointments(state) {
      state.appointments = appointments
    },
    initializeContacts(state) {
      state.contacts = contacts
    },
    setActivePage(state, page) {
      state.activeDashboardPage = page
    },
    setReportPage(state, page) {
      state.activeReportPage = page
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
    logout(state) {
      state.user.isAuthenticated = false,
        state.user.preferences.darkMode = false
    },
    TOGGLE_DARK_MODE(state) {
      state.user.preferences.darkMode = !state.user.preferences.darkMode // update the user preferences
    }
  },
  actions: {
    attemptAuth({ commit, dispatch }, credentials) {
      axios({ url: 'https://localhost:5001/api/users/auth', data: credentials, method: 'POST' })
        .then(resp => {
          if (resp.status == 200) {
            commit("SET_TOKEN", resp.data.token)
            dispatch('getUserData', resp.data.userId)
          } else if (resp.status == 400) {
            console.log("wrong password combo") // replace with way to show error message
          }
        })
        .catch(error => console.log(error))
    },
    getUserData({ commit, state }, userId) {
      axios({ url: `https://localhost:5001/api/users/${userId}`, method: 'GET', headers: { 'Authorization': `Bearer ${state.auth.token}` } })
        .then(resp => {
          commit("SET_USER", resp.data)
          this.$router.push({ name: 'Dashboard' })
      })
    }
  },
  modules: {
  },
})
