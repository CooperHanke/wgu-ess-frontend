import Vue from 'vue'
import Vuex from 'vuex'
import appointments from "@/data/appointments.json"; // for local testing
import contacts from "@/data/contacts.json"; // for local testing

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      username: "Test User",
      isAuthenticated: false,
      type: 'not-set'
    },
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
    initializeAppointments(state) {
      state.appointments = appointments
    },
    initializeContacts(state) {
      state.contacts = contacts
    },
    setAuth(state) { // this should take a user object
      state.user.type = 'standard' // mock being normal user
      // manager is another type
      state.user.isAuthenticated = true
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
    saveContact(state) {
      // in real life, add this to the database, but for now, add it to the collection
      if (state.contact.data.id > -1) {
        const index = state.contacts.findIndex(a => a.id === state.contact.data.id)
        // before making the contact details completely different, make a backup of the existing contact
        const contactBeforeEdit = state.contacts[index].name
        console.log(contactBeforeEdit)
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
      state.user.isAuthenticated = false
    }
  },
  actions: {
  },
  modules: {
  },
})
