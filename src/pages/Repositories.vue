<i18n>
{
  "en": {
    "forget": "Forget",
    "owner": "Owner",
    "repository": "Repository"
  }
}
</i18n>

<template>
  <section class="section">
    <div class="columns">
      <div class="column">
        <repositoryAdd v-on:repository-added="addRepo"></repositoryAdd>
      </div>

      <div class="column">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <td>{{$t("owner")}}</td>
              <td>{{$t("repository")}}</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="repo in repositories" :key="repo.key">
              <td>{{repo.owner}}</td>
              <td>{{repo.repository}}</td>
              <td>
                <a class="button is-small is-danger is-outlined" @click="deleteRepo(repo.key)">
                  <span>{{$t("forget")}}</span>
                  <span class="icon is-small">
                    <i class="fas fa-times"></i>
                  </span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import repositoryAdd from '@/components/repositoryAdd'
export default {
  name: 'Repositories',
  data () {
    return {
      repositories: []
    }
  },
  methods: {
    addRepo: function(event) {
      let parts = event.repository.split('/');
      this.repositories.push({key: event.repository, owner: parts[0], repository: parts[1], token: event.token, enterpriseUrl: event.enterpriseUrl});
      this.$ls.set("repositories", JSON.stringify(this.repositories));
    },
    deleteRepo: function(repository) {
      let data = JSON.parse(this.$ls.get("repositories"));
      let index = -1;

      for (let i = 0; i < data.length; i++) {
        let elem = data[i];
        if (elem.key === repository) {
          index = i;
          break;
        }
      }

      if (index > -1) {
        data.splice(index, 1);
        this.repositories = data;
        this.$ls.set("repositories", JSON.stringify(data));
      }
     }
  },
  computed: {
  },
  mounted: function() {
      var jsonData = this.$ls.get("repositories");
      if (jsonData === null || jsonData === undefined) return;
      var data = JSON.parse(jsonData);
      this.repositories = data;
  },
  components: {
    repositoryAdd
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
