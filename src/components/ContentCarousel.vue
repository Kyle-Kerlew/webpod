<template>
  <div v-if="this.currentImage" class="wrapper">
    <ul class="items">
      <li v-for='item in this.options' :key="item" class='item' :class="{active: item === this.currentImage}">
        <slot v-if="this.type === 'img'" :item="item" :type="this.type"></slot>
      </li>
      <slot v-if="this.type === 'custom'" :type="this.type"></slot>

    </ul>
  </div>
</template>
<script>
export default {
  name: 'ContentCarousel',
  props: {
    options: Array,
    type: String
  },
  data() {
    return {
      currentImage: this.options[0],
    }
  },
  methods: {
    runPanAnimation(previousImageUrlSelected = this.options[0]) {
      this.currentImage = this.getCurrentImage(previousImageUrlSelected);
      setTimeout(() => {
        if (!this.options || this.options.length === 1) {
          return;
        }
        this.runPanAnimation(this.currentImage);
      }, 6000)
    },

    getCurrentImage(previousImageUrlSelected) {
      if (!this.options) {
        return;
      }
      if (this.options.length === 1) {
        return this.options[0];
      }
      const num = this.getRandomNumber(previousImageUrlSelected);
      return this.options[num];

    },
    getRandomNumber(prev) {
      let num = 0;
      do {
        num = Math.floor(Math.random() * this.options.length);
      } while (this.options[num] === prev);
      return num;
    },
    arraysEqual(arr1, arr2) {
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    }
  },
  mounted() {
    this.runPanAnimation();
  },
  watch: {
    options(curr, prev) {
      if (!this.arraysEqual(curr, prev)) {
        this.currentImage = curr[0]
      }
    }
  }
}
</script>
<style scoped>

.wrapper, .wrapper img {
  max-height: 230px;
}

.item {
  grid-column-start: 1;
  grid-row-start: 1;
}

.items {
  padding: unset;
  margin: unset;
  display: grid;
}

.wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.items > li {
  height: 100%;
  list-style-type: none;
  z-index: 0;
  transition: opacity 1s linear;
}

.items > li:not(.active) {
  opacity: 0;
}

.active {
  opacity: 1;
}


</style>
