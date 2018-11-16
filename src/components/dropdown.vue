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
          <span>{{display}}</span>
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
  name: 'simple-dropdown',
  props: [
    'value',
    'data'
  ],
  data: function () {
    return {
      displayLookup: {},
      display: '',
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
        // map the text back to the value
        let len = this.data.length;
        let eventValue = event.target.text;
        for (let i = 0; i < len; i++){
          if (this.data[i].display == event.target.innerText) {
            eventValue = this.data[i].key;
            parent.display = this.data[i].display;
            break;
          }
        }

        this.$emit('selection-made', eventValue);
      }
    }
  },
  components: {
  },
  mounted: function () {
    let parent = this;
    parent.data.forEach(d => {
      parent.displayLookup[d.key] = d.display
    });
    parent.display = parent.displayLookup[parent.value];
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
