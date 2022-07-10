<template>
  <div class="row-container">
    <p>{{ this.convertToFormattedString(this.currentTimeInSeconds) }}</p>
    <div class="progress-container">
      <div ref="progressBar" class="progress-bar"/>
    </div>
    <p>{{ this.convertToFormattedString(this.currentSong.length - this.currentTimeInSeconds) }}</p>

  </div>
</template>

<script>
import {mapState} from "pinia/dist/pinia.mjs";
import {usePlayerStore} from "@/store";
import {PLAYER_STATE} from "@/constants/PlayerState";
import {mapActions} from "pinia/dist/pinia";

export default {
  name: "SongProgress",
  data() {
    return {
      currentTimeInSeconds: 0
    }
  },
  computed: {
    ...mapState(usePlayerStore, ['currentSong', 'playerState'])
  },
  mounted() {
    this.play();
  },
  methods: {
    ...mapActions(usePlayerStore, ['setPlaying']),
    convertToFormattedString(totalSeconds) {
      const minutesFractional = totalSeconds / 60; //this can be fractional. Check for potential issues
      const minutesAsString = minutesFractional.toString();
      const minutesWholeNumber = Math.floor(minutesFractional);

      let seconds = Math.round(parseFloat(minutesAsString.substring(minutesAsString.indexOf('.'), minutesAsString.length)) * 60);
      if (seconds === 60) {
        seconds = 0;
      }
      const secondsWithPrefixedZero = seconds < 10 && "0" + seconds;
      return `${minutesWholeNumber}:${secondsWithPrefixedZero || seconds}`;
    },
    updateProgressBar() {
      this.$refs.progressBar.style.width = Math.floor(this.currentTimeInSeconds / this.lengthInSeconds * 100) + "%"
    },
    play() {
      if (this.playerState === PLAYER_STATE.PAUSED) {
        return;
      }
      if (this.currentTimeInSeconds === this.lengthInSeconds) {
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
      if (playerState === PLAYER_STATE.PLAYING) {
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
