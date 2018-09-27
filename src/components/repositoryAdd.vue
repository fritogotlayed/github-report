<i18n>
{
  "en": {
    "accessToken": "Access Token",
    "accessTokenPlaceholder": "12345abcde",
    "addRepositoryButton": "Add Repository",
    "enterpriseUrl": "Enterprise Url (Optional)",
    "enterpriseUrlPlaceholder": "https://github.internal.local",
    "report": "Report",
    "repository": "Repository",
    "repositoryPlaceholder": "owner/repo"
  }
}
</i18n>

<template>
  <div>
    <formInput :label="$t('repository')" :placeholder="$t('repositoryPlaceholder')" name="Repository" v-model="repository">
      <template slot="decoration">
        <span class="icon is-small is-left"><i class="fab fa-github"></i></span>
      </template>
    </formInput>
    <formInput :label="$t('accessToken')" :placeholder="$t('accessTokenPlaceholder')" name="AccessToken" v-model="accessToken" type="password">
      <template slot="decoration">
        <span class="icon is-small is-left"><i class="fas fa-key"></i></span>
      </template>
    </formInput>
    <formInput :label="$t('enterpriseUrl')" :placeholder="$t('enterpriseUrlPlaceholder')" name="EnterpriseUrl" v-model="enterpriseUrl">
      <template slot="decoration">
        <span class="icon is-small is-left"><i class="fab fa-github"></i></span>
      </template>
    </formInput>
    <div class="field">
      <div class="control">
        <button class="button is-primary is-pulled-right" @click="addRepository" :disabled="addingRepository">{{$t("addRepositoryButton")}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/utils'
import axios from 'axios'
import formInput from '@/components/formInput'

export default {
  name: 'repository-add',
  data: function () {
    return {
      accessToken: '',
      addingRepository: false,
      enterpriseUrl: '',
      repository: ''
    }
  },
  methods: {
    addRepository() {
      this.addingRepository = true;
      let parts = this.repository.split('/')
      if (parts.length === 2 && this.accessToken.trim().length !== 0) {
        this.$emit('repository-added', {repository: this.repository, token: this.accessToken, enterpriseUrl: this.enterpriseUrl})
        this.clearForm();
      } else {
        // TODO: Error message
      }
      this.addingRepository = false;
    },
    clearForm() {
        this.repository = '';
        this.accessToken = '';
        this.enterpriseUrl = '';
    }
  },
  components: {
    formInput
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
