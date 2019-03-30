<i18n>
{
  "en": {
    "githubUtilities": "GitHub Utilities",
    "report": "Report",
    "settings": "Settings",
    "prWatcher": "PR Watcher"
  }
}
</i18n>

<template>
  <nav class="navbar is-dark is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" :to="{name:'Main'}">
        <label>{{$t('githubUtilities')}}</label>
      </router-link>
      <div v-bind:class="navBurgerCss" v-on:click="navBurgerClick">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div v-bind:class="menuBurgerCss">
      <div class="navbar-start">
        <!-- navbar items -->
        <a class="navbar-item" v-on:click="_navHelper({name: 'Report'})">{{$t('report')}}</a>
        <a class="navbar-item" v-on:click="_navHelper({name: 'PrWatcher'})">{{$t('prWatcher')}}</a>
        <a class="navbar-item" v-on:click="_navHelper({name: 'Settings'})">{{$t('settings')}}</a>
      </div>
      <div class="navbar-end">
        <!-- navbar items -->
        <!-- This is where any items you want pulled to the right of the nav should go. -->
      </div>
    </div>
  </nav>
</template>

<script>
import utils from '@/utils'
import axios from 'axios'

export default {
  name: 'nav-bar',
  data: function () {
    return {
      navBurgerCss: {
        'navbar-burger': true,
        'burger': true,
        'is-active': false
      },
      menuBurgerCss: {
        'navbar-menu': true,
        'is-active': false
      }
    }
  },
  methods: {
    navBurgerClick: function (event) {
      var newVal = !this.navBurgerCss['is-active']
      this._setNavState(newVal)
    },
    _setNavState: function (state) {
      this.navBurgerCss['is-active'] = state
      this.menuBurgerCss['is-active'] = state
    },
    _navHelper: function (target) {
      this._setNavState(false)
      this.$router.push(target)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
