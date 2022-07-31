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

import {SCREENS} from "@/data/Screens";

export default {

  name: 'OptionSelection',
  props: {
    screen: Object,
    hideArtist: Boolean,
    selectedOption: [String, Object],
  },
  data() {
    return {
      counter: 0,
    }
  },
  computed: {
    currentlySelected() {
      return this.currentItems[this.currentItems.indexOf(this.selectedOption)];
    },
    currentItems() {
      // if (this.screen?.name === SCREENS.ARTISTS?.name || this.screen?.name === SCREENS.ALBUMS.name) {
      //   return this.removeDuplicates([...Object.values(this.screen.options)], this.screen.name === SCREENS.ARTISTS.name, this.screen.name === SCREENS.ALBUMS.name);
      // }
      return Object.values(this.screen.options);
    }
  },
  watch: {
    currentItems(curr, prev) {
      if (prev) {
        this.$refs.options.width = ""
      }
    },
    currentlySelected: {
      handler(curr) {
        if (this.screen.name !== SCREENS.ARTISTS.name) {
          return;
        }
        this.counter++;
        console.log(this.counter)
        const element = document.getElementById(curr.id);
        const elementBounds = element.getBoundingClientRect()
        const bounds = this.$refs.options.getBoundingClientRect();
        const height = element.clientHeight;
        if (bounds.height - 20 < elementBounds.y - 20) {
        console.log("height to scroll", height)
          this.$refs.options.scrollBy({top: height, behavior: 'instant'})
        } else if (bounds.top - 20 > elementBounds.y - 20) {
        console.log("height to scroll", height)
          this.$refs.options.scrollBy({top: -height, behavior: 'instant'})
        }
      },
      flush: 'post'
    }
  }
}
</script>

<style>
.options {
  list-style-type: none;
  min-width: 100%;
  height: 100%;
  padding: unset;
  margin: unset;
  overflow-y: auto;
}

.options > li {
  padding: 3px 0 3px 5px;
  font-weight: bold;
}

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
</style>
