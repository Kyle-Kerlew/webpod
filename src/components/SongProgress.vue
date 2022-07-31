<template>
  <div v-if="this.currentSong" class="row-container">
    <p>{{ this.convertToFormattedString(this.currentTimeInSeconds) }}</p>
    <div class="progress-container">
      <div ref="progressBar" class="progress-bar"/>
    </div>
    <p>{{
        this.convertToFormattedString(this.lengthInSeconds(this.currentSong.duration_ms) - this.currentTimeInSeconds)
      }}</p>

  </div>
</template>

<script>
import {mapState} from "pinia/dist/pinia.mjs";
import {usePlayerStore} from "@/store";
import {PlayerState} from "@/constants/PlayerState";
import {mapActions} from "pinia/dist/pinia";

export default {
  name: "SongProgress",
  data() {
    return {
      currentTimeInSeconds: 0
    }
  },
  props: {
    currentSong: Object
  },
  computed: {
    ...mapState(usePlayerStore, ['playerState'])
  },
  mounted() {
    this.play();
  },
  methods: {
    ...mapActions(usePlayerStore, ['setPlaying']),
    lengthInSeconds(timeInMilliseconds) {
      return Math.round(timeInMilliseconds * 0.001);
    },
    convertToFormattedString(totalSecondsFrac) {
      const totalSeconds = Math.round(totalSecondsFrac)
      const minutesFractional = totalSeconds / 60; //this can be fractional. Check for potential issues
      const minutesAsString = minutesFractional.toString();
      const minutesWholeNumber = Math.floor(minutesFractional);

      let seconds = Math.round(parseFloat(minutesAsString.substring(minutesAsString.indexOf('.'), minutesAsString.length)) * 60);
      if (seconds > 59) {
        seconds = 0;
      }
      const secondsWithPrefixedZero = seconds < 10 && "0" + seconds;
      return `${minutesWholeNumber}:${secondsWithPrefixedZero || seconds}`;
    },
    updateProgressBar() {
      this.$refs.progressBar.style.width = Math.floor(this.currentTimeInSeconds / this.lengthInSeconds(this.currentSong.duration_ms) * 100) + "%"
    },
    play() {
      if (this.playerState === PlayerState.PAUSED) {
        return;
      }
      if (this.currentTimeInSeconds === this.lengthInSeconds(this.currentSong.duration_ms)) {
        this.$emit('end-song');
        return;
      }
      setTimeout(() => {
        this.currentTimeInSeconds++;
        this.play();
        this.updateProgressBar();
      }, 1000)
    }
  },
  watch: {
    playerState(playerState) {
      if (playerState === PlayerState.PLAYING) {
        this.play();
      }
    },
    currentSong() {
      this.currentTimeInSeconds = 0;
    }
  }
}
</script>

<style scoped>
.progress-container {
  display: flex;
  box-shadow: black 0 0 8px 0 inset;
  background-color: white;
  height: 20px;
  width: 75%;
}

.row-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 100%;
}

.progress-bar {
  width: 0;
  background-color: #086aea;
}

</style>
