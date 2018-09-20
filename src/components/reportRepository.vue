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
            <div :class="dropdownFromCss" v-on:click="dropdownFromClick">
              <div class="dropdown-trigger">
                <button class="button" aria-haspopup="true" aria-controls="dropdown-menu-from">
                  <span>{{fromMarker}}</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu-from" role="menu">
                <div class="dropdown-content">
                  <a v-for="tag in tags" :key="tag.node_id" :href="'#' + tag.name" class="dropdown-item">
                    {{tag.name}}
                  </a>
                </div>
              </div>
            </div>
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
            <div :class="dropdownToCss" v-on:click="dropdownToClick">
              <div class="dropdown-trigger">
                <button class="button" aria-haspopup="true" aria-controls="dropdown-menu-to">
                  <span>{{toMarker}}</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu-to" role="menu">
                <div class="dropdown-content">
                  <a v-for="tag in tags" :key="tag.node_id" :href="'#' + tag.name" class="dropdown-item">
                    {{tag.name}}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
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
      selected: false,
      dropdownFromCss: {
        'dropdown': true,
        'is-right': true,
        'is-active': false
      },
      dropdownToCss: {
        'dropdown': true,
        'is-right': true,
        'is-active': false
      }
    }
  },
  methods: {
    dropdownFromClick: function (event, a, b, c) {
      this.dropdownFromCss['is-active'] = !this.dropdownFromCss['is-active'];
      event.preventDefault();

      if (event.target.text) {
        this.fromMarker = event.target.text.trim();
        this.raiseValueChanged();
      }
    },
    dropdownToClick: function (event) {
      this.dropdownToCss['is-active'] = !this.dropdownToCss['is-active'];
      event.preventDefault();

      if (event.target.text) {
        this.toMarker = event.target.text.trim();
        this.raiseValueChanged();
      }
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
      let gh = new GitHub({
        token: this.value.token
      });
      let repo = gh.getRepo(this.value.key)
      let parent = this;
      repo.listTags().then(function(resp){
        parent.tags = resp.data;
        parent.tags.unshift({node_id: "0", name: "HEAD"});
      });
    }
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
