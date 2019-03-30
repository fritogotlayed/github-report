// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import VueLocalStorage from 'vue-localstorage'

Vue.config.productionTip = false

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {
    }
  }
})

Vue.use(VueLocalStorage, {
  name: 'ls',  // makes $ls a thing
  bind: true  // creates computed methods for defined items.
});
let localStorage = {
  repositories: {
    type: Array,
    default: []
  }
}

/* eslint-disable no-new */
new Vue({
  i18n,
  store,
  localStorage,
  // el: '#app',
  router,
  // components: { App },
  // template: '<App/>'
  render: h => h(App),
}).$mount('#app')
