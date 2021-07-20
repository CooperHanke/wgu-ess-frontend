import axios from 'axios'
import moment from 'moment'

export default {
  namespaced: true,
  state: () => ({
    appointments: [],
    appointment: {},
    showDialog: false,
    appointmentsLoading: false,
    allAppointmentsLoading: false,
    appointmentLoadingForEdit: false,
    contactId: '',
    reminders: [],
    allAppointments: []
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
      state.appointment.appointmentId = null
      state.contactId = null
    },
    SET_APPOINTMENTS_LOADING_STATE(state, flag) {
      state.appointmentsLoading = flag
    },
    TOGGLE_APPOINTMENTS_DIALOG(state, flag) {
      state.showDialog = flag
    },
    SET_CONTACT_FOR_APPOINTMENT(state, contactId) {
      state.contactId = contactId
    },
    SET_EDIT_APPOINTMENT_LOADING_STATE(state, flag) {
      state.appointmentLoadingForEdit = flag
    },
    CLEAR_APPOINTMENTS_ON_LOGOUT(state) {
      state.appointments = []
      state.appointment = {}
      state.contactId = null
    },
    SET_REMINDERS(state, reminders) {
      state.reminders = reminders
    },
    SET_ALL_APPOINTMENTS(state, appointments) {
      state.allAppointments = appointments
    }
  },
  actions: {
    loadAppointmentsByLoggedInUser({ commit, dispatch, rootGetters }) {
      commit("SET_APPOINTMENTS_LOADING_STATE", true)
      let reminders = []
      dispatch('contacts/loadContactsByLoggedInUser', null, { root: true }).then(() => 
        axios({ url: `appointments/user/${rootGetters['auth/userId']}`, method: 'GET', headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
          .then(resp => {
            resp.data.forEach(appointment => {
              // create the contact's name as we have the data
              const contact = rootGetters['contacts/contacts'].find(contact => contact.id === appointment.contactId)
              appointment.name = contact.firstName + ' ' + contact.lastName
              // parse the date and time from the server
              appointment.startDateTime = appointment.startDate
              appointment.endDateTime = appointment.endDate
              // format the data into something useful to our application
              appointment.startDate = moment(appointment.startDateTime).format('l')
              appointment.startTime = moment(appointment.startDateTime).format('LT')
              appointment.endDate = moment(appointment.endDateTime).format('l')
              appointment.endTime = moment(appointment.endDateTime).format('LT')

              appointment.startDateTimeDisplay = appointment.startDate + ' ' + appointment.startTime
              appointment.endDateTimeDisplay = appointment.endDate + ' ' + appointment.endTime

              if (appointment.needReminder) {
                if (moment().isSameOrAfter(appointment.reminderTime)) {
                  reminders.push(appointment)
                }
                appointment.reminderTime = moment(appointment.reminderTime).format('LT')
              } else {
                appointment.reminderTime = ''
              }
            });
            commit("SET_REMINDERS", reminders)
            commit("SET_APPOINTMENTS", resp.data)
            commit("SET_APPOINTMENTS_LOADING_STATE", false)
          })
          .catch(error => {
            if (error.response) {
              dispatch('ui/showSnackbar', error.response.data, { root: true })
              commit("SET_APPOINTMENTS_LOADING_STATE", false)
            }
          })
      )
    },
    saveNewAppointment({ commit, dispatch, rootGetters }, appointment) {
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({ url: 'appointments', method: 'POST', data: appointment, headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
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
    },
    setAppointment({ commit, dispatch, rootGetters }, appointmentId) {
      commit('SET_EDIT_APPOINTMENT_LOADING_STATE', true)
      axios({ url: `appointments/${appointmentId}`, method: 'GET', headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
        .then(resp => {
          let appointment = resp.data
          appointment.startDateTime = appointment.startDate
          appointment.endDateTime = appointment.endDate
          appointment.reminderTime = moment(appointment.reminderTime).format('LT')
          appointment.startDate = moment(appointment.startDateTime).format('l')
          appointment.startTime = moment(appointment.startDateTime).format('LT')
          appointment.endDate = moment(appointment.endDateTime).format('l')
          appointment.endTime = moment(appointment.endDateTime).format('LT')
          commit("SET_APPOINTMENT", Object.assign({}, appointment))
          commit("SET_CONTACT_FOR_APPOINTMENT", appointment.contactId)
          commit('SET_EDIT_APPOINTMENT_LOADING_STATE', false)
        }).catch(error => {
          if (error.response) {
            dispatch('ui/showSnackbar', error.response.data, { root: true })
          }
          commit('SET_EDIT_APPOINTMENT_LOADING_STATE', false)
        })
    },
    saveExistingAppointment({ commit, dispatch, rootGetters }, appointment, purpose) {
      if (!appointment.isReminder) {
        dispatch('ui/toggleLoadingOverlay', true, { root: true })
      }
      axios({
        url: `appointments/${appointment.id}`,
        data: appointment,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${rootGetters['auth/token']}`,
        }
      })
        .then(() => {
          if (purpose !== 'reminder') {
            dispatch("ui/showSnackbar", `Successfully edited existing appointment on system`, { root: true })
          }
          commit('CLEAR_APPOINTMENT')
          dispatch('loadAppointmentsByLoggedInUser')
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
        .catch(error => {
          if (error.response) {
            dispatch('ui/showSnackbar', error.response.data)
          } else {
            dispatch("ui/showSnackbar", `Unable to update the appointment`, { root: true })
          }
          if (!appointment.isReminder) {
            commit('CLEAR_CONTACT')
            dispatch('ui/toggleLoadingOverlay', false, { root: true })
          }
        })
    },
    dismissReminder({ dispatch, rootGetters }, reminder) {
      const appointment = {
        id: reminder.id,
        title: reminder.title,
        description: reminder.description,
        location: reminder.location,
        url: reminder.url,
        type: reminder.type,
        startDate: reminder.startDateTime,
        endDate: reminder.endDateTime,
        needReminder: false,
        reminderTime: reminder.reminderDateTime,
        contactId: reminder.contactId,
        userId: rootGetters["auth/userId"]
      }
      appointment.isReminder = true
      dispatch('saveExistingAppointment', appointment, 'reminder')
      dispatch("ui/showSnackbar", `Dismissed reminder at ${reminder.startTime}`, { root: true })
    },
    deleteAppointment({ commit, dispatch, getters, rootGetters }) {
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({
        url: `appointments/${getters.appointmentId}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${rootGetters['auth/token']}`,
        }
      })
        .then(() => {
          commit('CLEAR_APPOINTMENT')
          dispatch('loadAppointmentsByLoggedInUser')
          dispatch("ui/showSnackbar", 'Successfully deleted the appointment', { root: true })
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
        .catch(() => {
          dispatch("ui/showSnackbar", 'Unable to delete the appointment', { root: true })
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
    },
    loadAllAppointments({ commit, dispatch, rootGetters }) {
      axios({ url: 'appointments', method: 'GET', headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
        .then(resp => {
          resp.data.forEach(appointment => {
            // parse the date and time from the server
            appointment.startDateTime = appointment.startDate
            appointment.endDateTime = appointment.endDate
            // format the data into something useful to our application
            appointment.startDate = moment(appointment.startDateTime).format('l')
            appointment.startTime = moment(appointment.startDateTime).format('LT')
            appointment.endDate = moment(appointment.endDateTime).format('l')
            appointment.endTime = moment(appointment.endDateTime).format('LT')

            appointment.startDateTimeDisplay = appointment.startDate + ' ' + appointment.startTime
            appointment.endDateTimeDisplay = appointment.endDate + ' ' + appointment.endTime
          });
          
          commit("SET_ALL_APPOINTMENTS", resp.data)
        })
        .catch(error => {
          if (error.response) {
            dispatch('ui/showSnackbar', error.response.data, { root: true })
          }
        })
    },
  },
  getters: {
    appointment: (state) => state.appointment,
    appointments: (state) => state.appointments,
    showDialog: (state) => state.showDialog,
    appointmentId: (state) => state.appointment.id,
    appointmentsLoading: (state) => state.appointmentsLoading,
    appointmentLoadingForEdit: (state) => state.appointmentLoadingForEdit,
    contactId: (state) => state.contactId,
    reminders: (state) => state.reminders,
    allAppointments: (state) => state.allAppointments
  }
}