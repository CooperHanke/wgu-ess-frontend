import axios from 'axios'
import moment from 'moment'

export default {
  namespaced: true,
  state: () => ({
    appointments: [],
    appointment: {},
    showDialog: false,
    appointmentsLoading: false,
    appointmentLoadingForEdit: false,
    contactId: ''
  }),
  mutations: {
    SET_APPOINTMENT(state, appointment) {
      state.appointment = appointment
    },
    SET_APPOINTMENTS(state, appointments) {
      state.appointments = appointments
    },
    CLEAR_APPOINTMENT(state) {
      state.appointment = {}
    },
    SET_APPOINTMENTS_LOADING_STATE(state, flag) {
      state.appointmentsLoading = flag
    },
    TOGGLE_APPOINTMENTS_DIALOG(state, flag) {
      state.showDialog = flag
    },
    SET_CONTACT_FOR_APPOINTMENT(state, contactId) {
      state.contactId = contactId
    }
  },
  actions: {
    loadAppointmentsByLoggedInUser({ commit, dispatch, rootGetters }) {
      commit("SET_APPOINTMENTS_LOADING_STATE", true)
      dispatch('contacts/loadContactsByLoggedInUser', null, { root: true })
      axios({ url: `https://localhost:5001/api/appointments/user/${rootGetters['auth/userId']}`, method: 'GET', headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
        .then(resp => {
          resp.data.forEach(appointment => {
            // create the contact's name as we have the data
            const contact = rootGetters['contacts/contacts'].find(contact => contact.id === appointment.contactId)
            appointment.name = contact.firstName + ' ' + contact.lastName
            // parse the date and time from the server
            const originStartDate = appointment.startDate
            const originEndDate = appointment.endDate
            appointment.startDate = moment(originStartDate).format('l')
            appointment.startTime = moment(originStartDate).format('LT')
            appointment.endDate = moment(originEndDate).format('l')
            appointment.endTime = moment(originEndDate).format('LT')
          });
          commit("SET_APPOINTMENTS", resp.data)
          commit("SET_APPOINTMENTS_LOADING_STATE", false)
        })
        .catch(error => {
          if (error.response) {
            dispatch('ui/showSnackbar', error.response.data, { root: true })
            commit("SET_APPOINTMENTS_LOADING_STATE", false)
          }
        })
    },
    saveNewAppointment({ commit, dispatch, rootGetters }, appointment) {
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({ url: `https://localhost:5001/api/appointments`, method: 'POST', data: appointment, headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
        .then(() => {
          dispatch('ui/showSnackbar', `Successfully added new appointment to the system`, { root: true })
          commit('CLEAR_APPOINTMENT')
          dispatch('loadAppointmentsByLoggedInUser')
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
        .catch(error => {
          if (error.response) {
            dispatch('ui/showSnackbar', error.response.data, { root: true })
          }
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
    }
  },
  getters: {
    appointment: (state) => state.appointment,
    appointments: (state) => state.appointments,
    showDialog: (state) => state.showDialog,
    appointmentId: (state) => state.appointment.id,
    appointmentsLoading: (state) => state.appointmentsLoading,
    appointmentLoadingForEdit: (state) => state.appointmentLoadingForEdit,
    contactId: (state) => state.contactId
  }
}