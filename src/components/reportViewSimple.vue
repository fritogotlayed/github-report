<i18n>
{
  "en": {
    "from": "From",
    "generatedAt": "Generated At",
    "repo": "Repo",
    "to": "To"
  }
}
</i18n>

<template>
<div>
  <div v-for="report in reportData" :key="report.repo">
    <div>
      <strong>{{$t("repo")}}</strong> {{report.repo}}
    </div>

    <div>
      <strong>{{$t("from")}}</strong> {{report.fromMarker}}
    </div>

    <div>
      <strong>{{$t("to")}}</strong> {{report.toMarker}}
    </div>

    <div>
      <strong>{{$t("generatedAt")}}</strong> {{report.generatedAt}}
    </div>

    <ul class="pr-list">
      <li v-for="data in report.data" :key="data.url" >
        <a :href="data.url" target="_blank">{{data.message}}</a>
        <a class="button is-white is-loading" v-if="data.isLoading"></a>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  name: 'report-view-simple',
  props: [
    'reportData'
  ],
  data: function() {
    return {
    }
  },
  methods: {
  },
  components: {
  }
}
</script>

<style scoped>
</style>