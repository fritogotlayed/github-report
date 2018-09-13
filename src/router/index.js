import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'
import Repositories from '@/pages/Repositories'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'Main', component: Main },
    { path: '/Repositories', name: 'Repositories', component: Repositories }
  ]
})
