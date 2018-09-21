<i18n>
{
  "en": {
  }
}
</i18n>

<template>
  <div class="control">
    <div :class="dropdownCSS" v-on:click="dropdownClick">
      <div class="dropdown-trigger">
        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu-from">
          <span>{{value}}</span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div class="dropdown-menu" id="dropdown-menu-from" role="menu">
        <div class="dropdown-content">
          <a v-for="item in data" :key="item.key" href="#" class="dropdown-item">
            {{item.display}}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* Example dropdownData
  {
    display: "Text",
    key: "text"
  }

  Events:
  * selection-made
*/

export default {
  name: 'repository-add',
  props: [
    'value',
    'data'
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
    dropdownClick: function (event) {
      let parent = this;
      parent.dropdownCSS['is-active'] = !parent.dropdownCSS['is-active'];

      if (event.target.text) {
        this.dropdownCSS['is-active'] = false;
        this.$emit('selection-made', event.target.text);
      }
    }
  },
  components: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
