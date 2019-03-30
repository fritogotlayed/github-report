<i18n>
{}
</i18n>

<template>
  <div>
    <h1 class="title is-6">
      {{title}}
    </h1>
    <table class="table is-fullwidth is-narrow prWatchGroupTable">
      <thead>
        <td class="linkColumn"></td>
        <td class="ageColumn">Age</td>
        <td class="repoColumn">Repo</td>
        <td class="titleColumn">Title</td>
        <td class="authorColumn">Author</td>
        <td class="reviewersColumn">Reviewers</td>
      </thead>
      <tbody>
        <tr v-for="pr in pullRequests" :key="pr.key">
        <td><a :href="pr.pullUrl" target="_blank" rel="noopener noreferrer">View</a></td>
        <td>{{convertToHumanReadable(pr.ageMs)}}</td>
        <td>{{pr.repo}}</td>
        <td>{{pr.title}}</td>
        <td>{{pr.author}}</td>
        <td>
          {{Object.keys(pr.reviews).join(', ')}}
        </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
import { convertMsToHumanReadable } from '@/classes/utils.js'

export default {
  name: 'PrWatchGroup',
  props: ['pullRequests', 'title'],
  data: function() {
      return {
      }
  },
  methods: {
    convertToHumanReadable: function (value) {
      return convertMsToHumanReadable(value)
    }
  },
  components: {}
}
</script>

<style scoped>
.linkColumn {
  width: 5%
}
.ageColumn {
  width: 15%
}
.repoColumn {
  width: 15%
}
.titleColumn {
  width: 40%;
}
.authorColumn {
  width: 10%
}
.reviewersColumn {
  width: 15%
}
.prWatchGroupTable {
  margin-bottom: 48px
}
</style>