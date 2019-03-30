<i18n>
{
  "en": {
    "edit": "Edit",
    "forget": "Forget",
    "owner": "Owner",
    "repository": "Repository",
    "infoHeading": "Your Data",
    "infoBody": "The data entered in this screen / system is stored in the local browsers database.",
    "settingsHeading": "Settings",
    "addRepoHeading": "Add Repository",
    "editRepoHeading": "Edit Repository",
    "knownRepoHeading": "Known Repositories"
  }
}
</i18n>

<template>
  <section class="section">

    <h1 class="title">{{$t('settingsHeading')}}</h1>

    <article class="message is-info" v-show="showWarning">
      <div class="message-header">
        <p>{{$t('infoHeading')}}</p>
        <button class="delete" aria-label="delete" @click="hideWarning()"></button>
      </div>
      <div class="message-body">
        {{$t('infoBody')}}
      </div>
    </article>

    <div class="columns">

      <div class="column">
        <h1 class="title is-4">{{$t('knownRepoHeading')}}</h1>
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <td>{{$t("owner")}}</td>
              <td>{{$t("repository")}}</td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="repo in repositories" :key="repo.key">
              <td>{{repo.owner}}</td>
              <td>{{repo.repository}}</td>
              <td>
                <a class="button is-small is-info is-outlined" @click="editRepo(repo.key)">
                  <span>{{$t("edit")}}</span>
                  <span class="icon is-small">
                    <i class="fas fa-times"></i>
                  </span>
                </a>
              </td>
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

      <div class="column" v-show="editRepoData == null">
        <h1 class="title is-4">{{$t('addRepoHeading')}}</h1>
        <repositoryAdd v-on:repository-added="addRepo"></repositoryAdd>
      </div>

      <div class="column" v-show="editRepoData != null">
        <h1 class="title is-4">{{$t('editRepoHeading')}}</h1>
        <repositoryEdit :input="editRepoData" v-on:cancel-clicked="editRepoCancel" v-on:save-clicked="editRepoSaved"></repositoryEdit>
      </div>

    </div>
  </section>
</template>

<script>
import repositoryAdd from '@/components/repositoryAdd'
import repositoryEdit from '@/components/repositoryEdit'

export default {
  name: 'Settings',
  data () {
    return {
      repositories: [],
      showWarning: true,
      editRepoData: null,
      editRepoOldKey: null,
    }
  },
  methods: {
    addRepo: function(event) {
      let parts = event.repository.split('/');
      this.repositories.push({key: event.repository, owner: parts[0], repository: parts[1], token: event.token, enterpriseUrl: event.enterpriseUrl});
      this.$ls.set("repositories", JSON.stringify(this.repositories));
    },
    editRepo: function(repository) {
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
        this.editRepoOldKey = data[index].key
        this.editRepoData = data[index]
      }
    },
    editRepoSaved: function (newData) {
      let data = JSON.parse(this.$ls.get("repositories"));
      let index = -1;

      for (let i = 0; i < data.length; i++) {
        let elem = data[i];
        if (elem.key === this.editRepoOldKey) {
          index = i;
          break;
        }
      }

      if (index > -1) {
        // data.splice(index, 1);
        data[index] = newData
        this.repositories = data;
        this.$ls.set("repositories", JSON.stringify(data));
        this.editRepoData = null
        this.editRepoOldKey = null
      }
    },
    editRepoCancel: function () {
      this.editRepoData = null
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
    },
    hideWarning: function() {
      this.showWarning = false
      this.$ls.set("repositoriesShowWarning", false)
    }
  },
  computed: {
  },
  mounted: function() {
    var jsonData = this.$ls.get("repositories");
    if (jsonData === null || jsonData === undefined) return;
    var data = JSON.parse(jsonData);
    this.repositories = data;
    this.showWarning = (this.$ls.get("repositoriesShowWarning") == "true")
  },
  components: {
    repositoryAdd,
    repositoryEdit
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
