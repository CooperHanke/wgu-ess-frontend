import Vue from 'vue'
import Vuex from 'vuex'
import appointments from "@/data/appointments.json"; // for local testing

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      isAuthenticated: false
    },
    activeDashboardPage: '',
    appointment: {
      data: {
        id: -1,
        name: '',
        title: '',
        description: '',
        location: '',
        type: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
      },
      showDialog: false
    },
    appointments: []
  },
  mutations: {
    initializeAppointments(state) {
      state.appointments = appointments
    },
    setAuth(state) { // this should take a user object
      state.user.isAuthenticated = true
    },
    setActivePage(state, page) {
      state.activeDashboardPage = page
    },
    initializeAppointment(state) {
      state.appointment.data = {
        id: -1,
        name: '',
        title: '',
        description: '',
        location: '',
        type: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
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
        startTime: payload.startTime,
        startDate: payload.startDate,
        endTime: payload.endTime,
        endDate: payload.endDate
      }
    },
    saveAppointment(state) {
      // in real life, add this to the database, but for now, add it to the collection
      if (state.appointment.data.id > -1) {
        const index = state.appointments.findIndex(a => a.id === state.appointment.data.id)
        Object.assign(state.appointments[index], state.appointment.data)
      }
    },
    toggleDialog(state) {
      state.appointment.showDialog = !state.appointment.showDialog
    }
  },
  actions: {
  },
  modules: {
  },
})
