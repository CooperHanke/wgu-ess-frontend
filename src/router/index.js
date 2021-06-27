import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // down here, we are going to check for the mock state first
  if (to.name !== 'Login' && store.state.auth.token == null) next({ name: 'Login' })
  if (to.name === 'Login' && store.state.auth.token !== null) next({ name: 'Dashboard' })
  else next()
})

export default router
