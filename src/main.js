import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Axios from 'axios'

Vue.config.productionTip = false

// import axios into Vue's context so we don't need to keep calling it
Vue.prototype.$http = Axios;

const oldToken = localStorage.getItem('token')
const lastUserId = localStorage.getItem('userId')

// if the token and lastUserId are there, try to use them and set them to the store if token and user id are still good
// since vue isn't completely loaded at this time, we have to call axios a different way
if (oldToken !== null && lastUserId !== null) {
  Axios.get(`https://localhost:5001/api/users/${lastUserId}`, { headers: { 'Authorization': `Bearer ${oldToken}` } })
    .then(resp => {
        store.state.auth.currentUser = resp.data // if the user is still valid, load the user's data now
      })
    .catch( () => {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
    })
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
