import axios from 'axios';

export default {
  namespaced: true,
  state: () => ({
    contact: {},
    showDialog: false,
    contacts: [],
    contactsLoading: false,
    contactLoadingForEdit: false
  }),
  mutations: {
    SET_CONTACT(state, contact) {
      state.contact = contact
    },
    SET_CONTACTS(state, contacts) {
      state.contacts = contacts
    },
    CLEAR_CONTACT(state) {
      state.contact = {}
    },
    SET_CONTACTS_LOADING_STATE(state, flag) {
      state.contactsLoading = flag
    },
    SET_EDIT_CONTACT_LOADING_STATE(state, flag) {
      state.contactLoadingForEdit = flag
    },
    TOGGLE_CONTACTS_DIALOG(state, flag) {
      state.showDialog = flag
    },
    CLEAR_CONTACTS_ON_LOGOUT(state) {
      state.contacts = []
    }
  },
  actions: {
    loadContactsByLoggedInUser({ commit, dispatch, rootGetters }) {
      commit("SET_CONTACTS_LOADING_STATE", true)
      axios({ url: `contacts/user/${rootGetters['auth/userId']}`, method: 'GET', headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
        .then(resp => {
          resp.data.forEach(contact => {
            contact.name = contact.firstName + ' ' + contact.lastName
          });
          commit("SET_CONTACTS_LOADING_STATE", false)
          commit("SET_CONTACTS", resp.data)
        })
        .catch(error => {
          if (error.response) {
            commit("SET_CONTACTS_LOADING_STATE", false)
            dispatch('ui/showSnackbar', error.response.data, { root: true })
          }
        })
    },
    saveNewContact({ commit, dispatch, rootGetters }, contact) {
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({ url: 'contacts', method: 'POST', data: contact, headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
        .then(() => {
          dispatch('ui/showSnackbar', `Successfully added ${contact.firstName} ${contact.lastName} to system`, { root: true })
          commit('CLEAR_CONTACT')
          dispatch('loadContactsByLoggedInUser')
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
        .catch(error => {
          if (error.response) {
            dispatch('ui/showSnackbar', error.response.data, { root: true })
          }
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
    },
    setContact({ commit, dispatch, rootGetters }, contactId) {
      commit('SET_EDIT_CONTACT_LOADING_STATE', true)
      axios({ url: `contacts/${contactId}`, method: 'GET', headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
        .then(resp => {
          commit("SET_CONTACT", Object.assign({}, resp.data))
          commit('SET_EDIT_CONTACT_LOADING_STATE', false)
        }).catch(error => {
          if (error.response) {
            dispatch('ui/showSnackbar', error.response.data, { root: true })
          }
          commit('SET_EDIT_CONTACT_LOADING_STATE', false)
        })
    },
    saveExistingContact({ commit, dispatch, getters, rootGetters }, contact) {
      axios({
        url: `contacts/${getters.contactId}`,
        data: contact,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${rootGetters['auth/token']}`,
        }
      })
        .then(() => {
          dispatch("ui/showSnackbar", `Successfully edited existing contact ${contact.firstName} ${contact.lastName} on system`, { root: true })
          commit('CLEAR_CONTACT')
          dispatch('loadContactsByLoggedInUser')
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
        .catch(error => {
          if (error.response) {
            dispatch('ui/showSnackbar', error.response.data)
          } else {
            dispatch("ui/showSnackbar", `Unable to apply settings for ${contact.firstName} ${contact.lastName} on system`, { root: true })
          }
          commit('CLEAR_CONTACT')
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
    },
    deleteContact({ dispatch, getters, rootGetters }) {
      const contactName = getters.contactFullName
      dispatch('ui/toggleLoadingOverlay', true, { root: true })
      axios({
        url: `contacts/${getters.contactId}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${rootGetters['auth/token']}`,
        }
      })
        .then(() => {
          dispatch('loadContactsByLoggedInUser')
          dispatch("ui/showSnackbar", `Successfully deleted ${contactName} from the system`, { root: true })
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
        .catch(() => {
          dispatch("ui/showSnackbar", `Unable to delete ${contactName} from system`, { root: true })
          dispatch('ui/toggleLoadingOverlay', false, { root: true })
        })
    }
  },
  getters: {
    contact: (state) => state.contact,
    contacts: (state) => state.contacts,
    showDialog: (state) => state.showDialog,
    contactId: (state) => state.contact.id,
    contactsLoading: (state) => state.contactsLoading,
    contactLoadingForEdit: (state) => state.contactLoadingForEdit,
    contactFullName: (state) => state.contact.firstName + ' ' + state.contact.lastName
  }
}