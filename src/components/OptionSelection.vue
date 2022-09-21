<template>
  <div class="row">
    <ul ref="options" class="options" id="options">
      <li :id="item.id" v-for="item in this.currentItems"
          :class="{selected: item===this.currentlySelected, 'no-select':item===!this.currentlySelected}" :key="item.id">
        <slot v-if="typeof this.currentItems[0] !== 'string'" class="scroll-container" :hideArtist="this.hideArtist"
              :item="item">

        </slot>
        <div v-else>
          {{ item }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {

  name: 'OptionSelection',
  props: {
    screen: Object,
    hideArtist: Boolean,
    selectedOption: [String, Object],
  },
  computed: {
    currentlySelected() {
      return this.currentItems[this.currentItems.indexOf(this.selectedOption)];
    },
    currentItems() {
      return Object.values(this.screen.options);
    }
  },

  watch: {
    currentlySelected(curr) {
      const element = document.getElementById(curr.id);
      if (!element) {
        return;
      }
      const elementBounds = element.getBoundingClientRect();
      const bounds = this.$refs.options.getBoundingClientRect();
      const height = element.clientHeight;
      if (bounds.height < elementBounds.y - 20) {
        this.$refs.options.scrollBy({top: height, behavior: 'instant'})
      } else if (bounds.top > elementBounds.y - 20) {
        this.$refs.options.scrollBy({top: -height, behavior: 'instant'})
      }
    },
    currentItems() {
      //reset scroll position to top when an option is selected
      this.$refs.options.scrollTo({top: 0});
    }
  }
}
</script>

<style>

.selected {
  background-color: #086aea;
  color: white;
}

.no-select {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}

.row {
  /*100% height minus the text banner*/
  height: calc(100% - 21px);
}

.scroll-container {
  overflow-y: scroll;
}

.options > li {
  padding: 3px 0 3px 5px;
  font-weight: bold;
}

.options {
  list-style-type: none;
  min-width: 100%;
  height: 100%;
  padding: unset;
  margin: unset;
  overflow-y: auto;
}
</style>
