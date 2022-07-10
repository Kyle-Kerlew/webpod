<template>
  <WebpodApp/>
</template>

<script>

import WebpodApp from "@/components/WebpodApp";

export default {
  name: 'App',
  components: {
    WebpodApp
  }
}
</script>

<style>
body {
  font-family: sans-serif;
  font-size: 14px;
  background: black;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
  box-shadow: inset 0 0 5px grey;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: black;
  border-radius: 5px;

}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #1D1D1DFF;
  border-radius: 25px;
}
</style>
