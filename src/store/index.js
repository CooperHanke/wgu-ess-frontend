import Vue from 'vue'
import Vuex from 'vuex'

// import the modules
import auth from '@/store/auth.js'
import ui from '@/store/ui.js'
import users from '@/store/users.js'
import contacts from '@/store/contacts.js'
import appointments from '@/store/appointments.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    ui,
    users,
    contacts,
    appointments
  },
  state: {},
  mutations: {},
  actions: {},
  getters: {}
})