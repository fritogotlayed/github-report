<i18n>
{
  "en": {
    "from": "From",
    "includeOnReport": "Include on Report",
    "removeFromReport": "Remove from Report",
    "to": "To"
  }
}
</i18n>

<template>
  <div class="columns">

    <div class="column is-3">
      <label>{{this.value.key}}</label>
      <!--
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      -->
    </div>

    <div class="column is-9" v-if="!this.selected">
      <a class="button is-small is-success is-outlined" @click="activate">
        <span>{{$t("includeOnReport")}}</span>
        <span class="icon is-small">
          <i class="fas fa-plus"></i>
        </span>
      </a>
    </div>

    <div class="column" v-if="this.selected">
      <a class="button is-small is-danger is-outlined" @click="deactivate">
        <span>{{$t("removeFromReport")}}</span>
        <span class="icon is-small">
          <i class="fas fa-times"></i>
        </span>
      </a>
    </div>

    <div class="column" v-if="this.selected">

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label>{{$t("from")}}</label>
        </div>
        <div class="field-body">
          <div class="field">

            <Dropdown
              :value="fromMarker"
              :data="tags"
              @selection-made="fromSelectionMade" />

          </div>
        </div>
      </div>

    </div>

    <div class="column" v-if="this.selected">

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label>{{$t("to")}}</label>
        </div>
        <div class="field-body">
          <div class="field">

            <Dropdown
              :value="toMarker"
              :data="tags"
              @selection-made="toSelectionMade" />

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Dropdown from '@/components/dropdown'
let GitHub = require("github-api");

export default {
  name: 'ReportRepository',
  props: [
    'value'
  ],
  data () {
    return {
      tags: [],
      fromMarker: '',
      toMarker: '',
      selected: false
    }
  },
  methods: {
    fromSelectionMade: function (value) {
      this.fromMarker = value.trim();
      this.raiseValueChanged();
    },
    toSelectionMade: function (value) {
      this.toMarker = value.trim();
      this.raiseValueChanged();
    },
    activate: function () {
      this.selected = true;
      if (this.tags.length ===0) {
        this.fetchTags();
      }
    },
    deactivate: function () {
      this.toMarker = null;
      this.fromMarker = null;
      this.selected = false;
      this.raiseValueChanged();
    },
    raiseValueChanged: function () {
      this.value.toMarker = this.toMarker;
      this.value.fromMarker = this.fromMarker;
      this.value.selected = this.selected;
      this.$emit('input', this.value);
    },
    fetchTags: function () {
      let gh = null;
      if (this.value.enterpriseUrl){
        let url = this.value.enterpriseUrl;

        if (!url.endsWith("/")) {
          url += "/";
        }
        url += "api/v3"

        gh = new GitHub({
          token: this.value.token
        }, url);
      } else {
        gh = new GitHub({
          token: this.value.token
        });
      }
      let repo = gh.getRepo(this.value.key)
      let parent = this;
      repo.listTags().then(function(resp) {
        resp.data.forEach(t => {
          parent.tags.push({key: t.node_id, display: t.name})
        });
        parent.tags.unshift({key: "0", display: "HEAD"});
      });
    }
  },
  components: {
    Dropdown
  },
  mounted: function() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
