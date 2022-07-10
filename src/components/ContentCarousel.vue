<template>
  <ul class="wrapper">
    <li v-for='item in this.options' :key="item" class='item' :class="{active: item === this.currentImage}">
      <slot v-if="this.type === 'img'" :item="item" :type="this.type"></slot>
    </li>
    <slot v-if="this.type === 'custom'" :type="this.type"></slot>

  </ul>
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
  mounted: async function () {
    await this.runPanAnimation();
  },
  methods: {
    runPanAnimation(previousImageUrlSelected = this.options[0]) {
      this.currentImage = this.getCurrentImage(previousImageUrlSelected);
    },

    getCurrentImage(previousImageUrlSelected) {
      if (!this.options) {
        return;
      }
      if (this.options.length === 1) {
        return this.options[0];
      }
      const num = this.getRandomNumber(previousImageUrlSelected);
      setTimeout(() => {
        if (!this.options) {
          return;
        }
        this.runPanAnimation(this.options[num]);
      }, 6000)
      return this.options[num];

    },
    getRandomNumber(prev) {
      let num = 0;
      do {
        num = Math.floor(Math.random() * this.options.length);
      } while (this.options[num] === prev);
      return num;
    }
  },
  watch: {
    options(curr) {
      if (!curr || curr.length === 0) {
        return;
      }
      this.currentImage = curr[0];
      this.runPanAnimation(curr[0]);
    }
  }
}
</script>
<style scoped>

.wrapper, .wrapper img {
  max-height: 230px;
}

.item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper {
  padding: unset;
  margin: unset;
  width: 100%;
}

.wrapper > li {
  height: 100%;
  list-style-type: none;
  position: relative;
  z-index: 0;
  transition: opacity 1s linear;
}

.wrapper > li:not(.active) {
  opacity: 0;
}

.wrapper > li:not(:first-child) {
  bottom: 230px;
}

.active {
  opacity: 1;
}


</style>
