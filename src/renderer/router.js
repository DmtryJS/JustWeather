import Vue from 'vue'
import Router from 'vue-router'
import Main from './../views/Main.vue'
import Settings from './../views/Settings.vue'

Vue.use(Router)

export default new Router({
  //mode: 'history',
  routes: [
    {
      path: '/',
      component: Main
    },
    {
      path: '/settings',
      component: Settings
    }
  ]
})
