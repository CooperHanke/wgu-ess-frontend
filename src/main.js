import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Axios from 'axios'
// import axios from 'axios'

Vue.config.productionTip = false

// import axios into Vue's context so we don't need to keep calling it
Vue.prototype.$http = Axios;

const oldToken = localStorage.getItem('token')
console.log(oldToken)
const lastUserId = localStorage.getItem('userId')
console.log(lastUserId)

// if the token and lastUserId are there, try to use them and set them to the store if token and user id are still good
// since vue isn't completely loaded at this time, we have to call axios a different way
if (oldToken != null && lastUserId != null) {
  Axios.get(`https://localhost:5001/api/users/${lastUserId}`, { headers: { 'Authorization': `Bearer ${oldToken}` } } )
    .then(resp => {
      if (resp.status !== 200) {
        localStorage.removeItem('token')
        localStorage.removeItem('lastUserId')
      }
    })
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
