<i18n>
{
  "en": {
    "githubUtilitiesHeader": "Github Utilities",
    "message": "Welcome to the new Github Utilities! Please use the \"Report\" option above to use what was the previous landing page."
  }
}
</i18n>

<template>
  <section class="section">
      <h1 class="title">{{$t('githubUtilitiesHeader')}}</h1>
      <p>
        {{$t('message')}}
      </p>
  </section>
</template>

<script>

export default {
  name: 'Main',
  data () {
    return {}
  },
  methods: {
  },
  components: {
  },
  mounted: function() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
