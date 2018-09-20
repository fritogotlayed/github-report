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
  <div class="control">
    <div class="field has-addons" >
      <div class="control">
        <a class="button is-secondary" @click="$emit('click')">
          <span>{{this.buttonText}}</span>
        </a>
      </div>
      <div class="control">
        <div :class="dropdownCSS">
          <div class="dropdown-trigger">
            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="dropdownClick">
              <span class="icon is-small">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
              <a v-for="item in dropdownData" :key="item.key" class="dropdown-item" @click="optionSelected(item.key)">
                {{item.display}}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* Example dropdownData
  {
    key: "text",
    display: "Text"
  }

  Events:
  * selection-made
  * click
*/

export default {
  name: 'repository-add',
  props: [
    'buttonText',
    'dropdownData'
  ],
  data: function () {
    return {
      dropdownCSS: {
        'dropdown': true,
        'is-right': true,
        'is-active': false
      },
    }
  },
  methods: {
    dropdownClick: function () {
      let parent = this;
      parent.dropdownCSS['is-active'] = !parent.dropdownCSS['is-active'];
    },
    optionSelected: function (value) {
      this.dropdownCSS['is-active'] = false;
      this.$emit('selection-made', value);
    }
  },
  components: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
