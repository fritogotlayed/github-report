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
  <div v-for="report in data" :key="report.repo">
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
      <li v-for="author in report.authors" :key="author.name">
        {{author.name}}
        <ul class="author-pr-sectoin">
          <li v-for="data in author.data" :key="data.url" >
            <a :href="data.url" target="_blank">{{data.message}}</a>
            <a class="button is-white is-loading" v-if="data.isLoading"></a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import ReportExports from '@/classes/reportExports'

export default {
  name: 'report-view-by-user',
  props: [
    'reportData'
  ],
  data: function() {
    return {
      data: []
    }
  },
  methods: {
  },
  components: {
  },
  mounted: function () {
    let exp = new ReportExports();
    this.data = exp.restructureToAuthorOrganized(this.reportData);
  }
}
</script>

<style scoped>
</style>