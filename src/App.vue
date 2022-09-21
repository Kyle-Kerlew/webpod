<template>
  <WebpodApp/>
</template>

<script>

import WebpodApp from "@/components/WebpodApp.vue";

export default {
  name: 'App',
  components: {
    WebpodApp
  }
}
</script>

<style>

p, img, div {
 user-select: none;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  background: #7d7d7d;
  height: 100vh;
  overflow: hidden;
  margin: 0;
}
#app {
  height: 100%;
}
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
  box-shadow: inset 0 0 5px grey;
}

::-webkit-scrollbar-thumb {
  background: black;
  border-radius: 5px;

}

::-webkit-scrollbar-thumb:hover {
  background: #1D1D1DFF;
  border-radius: 25px;
}
</style>
