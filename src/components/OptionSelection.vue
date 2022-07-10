<template>
  <div class="row">
    <ul class="options" id="options">
      <li v-for="item in this.currentItems"
          :class="{selected: item===this.currentlySelected, 'no-select':item===!this.currentlySelected}" :key="item">
        <slot class="scroll-container" :hideArtist="this.hideArtist" :item="item">

        </slot>
        <div v-if="!custom">
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
    custom: Boolean,
    items: Object,
    screen: Object,
    hideArtist: Boolean,
    selectedOption: [String, Object],
    goingBack: Boolean,
  },

  data() {
    return {
      oldItems: undefined,
      nextItems: undefined,
      prevItems: undefined,
    }
  },
  methods: {
    //remove duplicates of
    removeDuplicates(array, removeDuplicateAlbums = false, removeDuplicateArtists = false) {
      const resultArray = {};
      if (removeDuplicateAlbums) {
        return array.filter(obj => !resultArray[obj.album] && (resultArray[obj.album] = true));
      }
      if (removeDuplicateArtists) {
        return array.filter(obj => !resultArray[obj.artist] && (resultArray[obj.artist] = true));
      }
      return this.currentItems;
    },
  },
  computed: {
    currentlySelected() {
      if (this.custom) {
        return this.currentItems.filter(items => items.id === this.selectedOption.id)[0];
      }
      return this.currentItems[this.currentItems.indexOf(this.selectedOption)];
    },
    currentItems() {
      if (!this.items) {
        return [];
      }

      if (this.screen?.name === SCREENS.ARTISTS?.name || this.screen?.name === SCREENS.ALBUMS.name) {
        return this.removeDuplicates([...Object.values(this.items)], this.screen.name === SCREENS.ARTISTS.name, this.screen.name === SCREENS.ALBUMS.name);
      }
      return Object.values(this.items);
    }
  },
}
</script>

<style>
.options {
  list-style-type: none;
  min-width: 100%;
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

.scroll-container {
  overflow-y: scroll;
}
</style>
