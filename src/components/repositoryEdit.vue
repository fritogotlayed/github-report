<i18n>
{
  "en": {
    "accessToken": "Access Token",
    "accessTokenPlaceholder": "12345abcde",
    "cancelEditButton": "Cancel",
    "enterpriseUrl": "Enterprise Url (Optional)",
    "enterpriseUrlPlaceholder": "https://github.internal.local",
    "report": "Report",
    "repository": "Repository",
    "repositoryPlaceholder": "owner/repo",
    "saveEditButton": "Save"
  }
}
</i18n>

<template>
  <div>
    <formInput :label="$t('repository')" :placeholder="$t('repositoryPlaceholder')" name="Repository" v-model="key">
      <template slot="decoration">
        <span class="icon is-small is-left"><i class="fab fa-github"></i></span>
      </template>
    </formInput>
    <formInput :label="$t('accessToken')" :placeholder="$t('accessTokenPlaceholder')" name="AccessToken" v-model="token" type="password">
      <template slot="decoration">
        <span class="icon is-small is-left"><i class="fas fa-key"></i></span>
      </template>
    </formInput>
    <formInput :label="$t('enterpriseUrl')" :placeholder="$t('enterpriseUrlPlaceholder')" name="EnterpriseUrl" v-model="enterpriseUrl">
      <template slot="decoration">
        <span class="icon is-small is-left"><i class="fab fa-github"></i></span>
      </template>
    </formInput>
    <div class="field is-grouped is-pulled-right">
      <div class="control">
        <button class="button" @click="cancelEdit" :disabled="savingRepository">{{$t("cancelEditButton")}}</button>
        <button class="button is-primary" @click="saveRepository" :disabled="savingRepository">{{$t("saveEditButton")}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/utils'
import axios from 'axios'
import formInput from '@/components/formInput'

export default {
  name: 'repository-edit',
  props: ['input'],
  data: function () {
    return {
      savingRepository: false,
    }
  },
  methods: {
    saveRepository() {
      this.savingRepository = true;
      let parts = this.key.split('/')
      if (parts.length === 2 && this.token.trim().length !== 0) {
        this.$emit('save-clicked', {key: this.key, token: this.token, enterpriseUrl: this.enterpriseUrl, owner: parts[0], repository: parts[1]})
      } else {
        // TODO: Error message
      }
      this.savingRepository = false;
    },
    cancelEdit() {
        this.$emit('cancel-clicked')
    }
  },
  computed: {
    key: {
      get: function () {
        if (this.input && this.input.key) {
          return this.input.key
        } else {
          return null
        }
      },
      set: function (val) {
        this.input.key = val
      }
    },
    token: {
      get: function () {
        if (this.input && this.input.token) {
          return this.input.token
        } else {
          return null
        }
      },
      set: function (val) {
        this.input.token = val
      }
    },
    enterpriseUrl: {
      get: function () {
        if (this.input && this.input.enterpriseUrl) {
          return this.input.enterpriseUrl
        } else {
          return null
        }
      },
      set: function (val) {
        this.input.enterpriseUrl = val
      }
    },
  },
  components: {
    formInput
  },
  mounted: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
