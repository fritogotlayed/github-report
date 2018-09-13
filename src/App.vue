<template>
  <div id="body" class="has-navbar-fixed-top">
    <nav-bar></nav-bar>
    <div>
      <router-view/>
    </div>
  </div>
</template>

<script>
import navBar from '@/components/navBar'

export default {
  name: 'App',
  data: function () {
    return {
    }
  },
  components: {
    navBar
  },
  methods: {
  }
}
</script>

<style>
#body {
  padding-top: 20px;
}
</style>
