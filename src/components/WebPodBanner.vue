<template>
  <div class="screen-banner">
    <p>{{ this.text }}</p>
    <img width="18" height="18" :src="this.icon" alt="Player Status"/>
  </div>
</template>

<script>
import {mapState} from "pinia/dist/pinia";

import {usePlayerStore} from "@/store";
import {PlayerState} from "@/constants/PlayerState";
import Play from '@/assets/svg/play-outline.svg';
import Pause from '@/assets/svg/pause-outline.svg';

export default {
  name: "WebPodBanner",
  computed: {
    ...mapState(usePlayerStore, ['playerState']),
    icon() {
      return this.playerState === PlayerState.PLAYING ? Play: Pause;
    }
  },
  data() {
    return {
      text: 'webpod.js',
    }
  }
}
</script>

<style scoped>
.screen-banner {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid black;
  background: linear-gradient(white 0%, gray 100%);
  align-items: center;
  height: 20px;
  padding: 0 5px;
}

.screen-banner > p {
  font-weight: bold;
  margin: unset;
}
</style>
