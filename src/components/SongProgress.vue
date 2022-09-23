<template>
  <div class="row-container">
    <p>{{ this.convertToFormattedString(this.currentTimeInSeconds) }}</p>
    <div class="progress-container">
      <div ref="progressBar" class="progress-bar"/>
    </div>
    <p>{{this.convertToFormattedString(this.lengthInSeconds(this.songQueue[this.getCurrentSongIndex()].duration_ms) - this.currentTimeInSeconds)
      }}</p>

  </div>
</template>

<script>
import {mapState} from "pinia/dist/pinia.mjs";
import {usePlayerStore} from "@/store";
import {PlayerState} from "@/constants/PlayerState";
import {mapActions} from "pinia/dist/pinia";
import {playSong} from "@/service/PlayerService";

export default {
  name: "SongProgress",
  data() {
    return {
      currentTimeInSeconds: 0,
      isMounted: true,
      intervalId: undefined,
    }
  },
  computed: {
    ...mapState(usePlayerStore, ['playerState', 'deviceId', 'songQueue', 'currentSongIndex', 'currentSongId'])
  },
  mounted() {
    this.isMounted = true;
    this.play();
  },
  unmounted() {
    this.isMounted = false;

  },
  methods: {
    ...mapActions(usePlayerStore, ['setPlaying', 'handleEndSong', 'skipSong', 'getCurrentSongIndex']),
    lengthInSeconds(timeInMilliseconds) {
      return Math.round(timeInMilliseconds * 0.001);
    },
    convertToFormattedString(totalSecondsFrac) {
      const totalSeconds = Math.round(totalSecondsFrac)
      const minutesFractional = totalSeconds / 60;
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
      this.$refs.progressBar.style.width = Math.floor(this.currentTimeInSeconds / this.lengthInSeconds(this.songQueue[this.getCurrentSongIndex()].duration_ms) * 100) + "%"
    },
    changeSongs() {
      this.currentTimeInSeconds = 0;
      clearInterval(this.intervalId);
      this.play();
    },
    play() {

      this.intervalId = setInterval(() => {
        if (this.currentTimeInSeconds === this.lengthInSeconds(this.songQueue[this.getCurrentSongIndex()].duration_ms)) {
          this.handleEndSong();
          const nextSong = this.songQueue[this.getCurrentSongIndex()];
          if (!this.isMounted) {
            playSong(this.deviceId, this.$cookies.get("access_token"), nextSong.id)
            this.changeSongs();
          } else {
            this.currentTimeInSeconds = 0;
            clearInterval(this.intervalId);
          }
          return;
        }
        if (this.playerState === PlayerState.PAUSED) {
          clearInterval(this.intervalId);
          return;
        }

        this.currentTimeInSeconds++;
        if (this.isMounted) {
          this.updateProgressBar();
        }
      }, 1000);
    }
  },
  watch: {
    playerState(playerState) {
      if (playerState === PlayerState.PLAYING) {
        this.play();
      }
    },
    currentSongId() {
      this.changeSongs();
    }
  }
}
</script>

<style scoped>
.progress-container {
  display: flex;
  background: linear-gradient(0deg, rgba(193, 193, 193, 1) 0%, rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 1) 83%, rgba(193, 193, 193, 1) 100%);
  height: 20px;
  width: 75%;
}

.row-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 100%;
  padding: 0 25px;
  -webkit-box-reflect: below 0 -webkit-gradient(linear, 0% 0%, 0% 100%, from(transparent), color-stop(0.6, transparent), to(rgba(250, 250, 250, 0.1)));
}

.row-container p {
  margin: unset;
}

.progress-bar {
  width: 0;
  background-image: linear-gradient(0deg, hsl(214deg 100% 69%) 0%, hsla(214, 93%, 47%, 1) 100%);
}

</style>
