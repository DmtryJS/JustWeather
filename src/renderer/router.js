import Vue from 'vue'
import Router from 'vue-router'
import Main from './../views/Main.vue'
import Settings from './../views/Settings.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})
