import axios from 'axios'

export default {
  namespaced: true,
  state: () => ({
    appointments: [],
    appointment: {},
    showDialog: false,
    appointmentsLoading: false,
    appointmentLoadingForEdit: false
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
      state.appointment.contactId = contactId
    },
    CLEAR_APPOINTMENT_CONTACT(state) {
      state.appointment.contactId = ''
    }
  },
  actions: {
    loadAppointmentsByLoggedInUser({ commit, dispatch, rootGetters }) {
      commit("SET_APPOINTMENTS_LOADING_STATE", true)
      axios({ url: `https://localhost:5001/api/appointments/user/${rootGetters['auth/userId']}`, method: 'GET', headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
        .then(resp => {
          commit("SET_APPOINTMENTS_LOADING_STATE", false)
          commit("SET_APPOINTMENTS", resp.data)
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
    appointmentContact: (state) => state.appointment.firstName + ' ' + state.appointment.lastName
  }
}