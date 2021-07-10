import axios from 'axios';

export default {
  namespaced: true,
  state: () => ({
    contact: {
      // id: -1,
      // name: '',
      // address1: '',
      // address2: '',
      // city: '',
      // state: '',
      // postalCode: '',
      // country: '',
      // phoneNumber: ''
    },
    showDialog: false,
    contacts: [],
    contactsLoading: false
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
    TOGGLE_CONTACTS_DIALOG(state, flag) {
      state.showDialog = flag
    }
  },
  actions: {
    loadContactsByLoggedInUser({ commit, rootGetters }) {
      // dispatch('ui/toggleLoadingOverlay', true)
      commit("SET_CONTACTS_LOADING_STATE", true)
      axios({ url: `https://localhost:5001/api/contacts/user/${rootGetters['auth/userId']}`, method: 'GET', headers: { 'Authorization': `Bearer ${rootGetters['auth/token']}` } })
        .then(resp => {
          commit("SET_CONTACTS_LOADING_STATE", false)
          commit("SET_CONTACTS", resp.data)
          // dispatch('ui/toggleLoadingOverlay', false)
        })
      }
  },
  getters: {
    contact: (state) => state.contact,
    contacts: (state) => state.contacts,
    showDialog: (state) => state.showDialog,
    contactId: (state) => state.contactId,
    contactsLoading: (state) => state.contactsLoading
  }
}