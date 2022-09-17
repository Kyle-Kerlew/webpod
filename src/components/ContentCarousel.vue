<template>
  <div class="wrapper">
    <div v-if="this.currentImage">
      <ul class="items">
        <li v-for='item in this.options' :key="item" class='item' :class="{active: item === this.currentImage}">
          <slot :item="item" :type="this.type"></slot>
        </li>
      </ul>
    </div>
    <slot v-else-if="this.type === 'custom'" :type="this.type"></slot>
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
      currentImage: this.options?.[0],
    }
  },
  methods: {
    runPanAnimation() {
      setInterval(() => {
        if (!this.options || this.options.length === 1) {
          return;
        }
        this.currentImage = this.getCurrentImage(this.currentImage || this.options?.[0]);
      }, 6000)
    },

    getCurrentImage(previousImageUrlSelected) {
      if (!this.options) {
        return;
      }
      if (this.options.length === 1) {
        return this.options?.[0];
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
        this.currentImage = curr?.[0]
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
