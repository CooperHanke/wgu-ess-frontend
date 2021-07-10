// import axios from axios;

export default {
  namespaced: true,
  state: () => ({
    contact: {
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
    showDialog: false,
    contacts: []
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
    
  },
  actions: {

  },
  getters: {
    contact: (state) => state.contact,
    contacts: (state) => state.contacts
  }
}