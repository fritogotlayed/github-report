import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'
import Report from '@/pages/Report'
import PrWatcher from '@/pages/PrWatcher'
import Settings from '@/pages/Settings'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'Main', component: Main },
    { path: '/Report', name: 'Report', component: Report },
    { path: '/PrWatcher', name: 'PrWatcher', component: PrWatcher },
    { path: '/Settings', name: 'Settings', component: Settings }
  ]
})
