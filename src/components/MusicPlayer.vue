<template>
  <WebPodBanner/>
  <div v-if="this.currentSong" class="info-container">
    <div class="row">
      <img class='skew' :src="this.currentSong?.album?.images?.[0].url" alt="Album Photo"/>
      <div class="text-container">
        <div class="primary">
          <p class="bolded">{{ this.currentSong?.name }}</p>
        </div>
        <div class="secondary">
          <p>{{ this.currentSong?.album.name }}</p>
          <p>{{ this.currentSong?.artists.map(artist => artist.name).join(", ") }}</p>
          <p>{{ `${this.currentSong?.track_number} of ${this.currentSong?.album.total_tracks}` }}</p>
        </div>
      </div>
    </div>
    <div class="full-width">
      <SongProgress :current-song="this.currentSong" @end-song="this.handleEndSong"/>
    </div>
  </div>
</template>

<script>
import SongProgress from "@/components/SongProgress";
import {mapActions, mapState} from "pinia";
import {usePlayerStore} from "@/store";
import {getSong, playSong} from "@/service/PlayerService";
import WebPodBanner from "@/components/WebPodBanner";

export default {
  name: "MusicPlayer",
  components: {SongProgress, WebPodBanner},
  props: {
    currentTrackMode: String,
  },
  data() {
    return {
      currentSong: undefined,
    }
  },
  computed: {
    ...(mapState(usePlayerStore, ['token', 'songQueue', 'deviceId', 'currentSongId', 'player'])),
  },
  mounted() {
    if (!this.currentSong) {
      getSong(this.$cookies.get('access_token'), this.currentSongId).then(async response => {
        this.currentSong = response;
        await this.play();
      });
    }
  },
  methods: {
    ...(mapActions(usePlayerStore, ['setCurrentSongId', 'clearQueue'])),
    async play() {
      await playSong(this.deviceId, this.$cookies.get('access_token'), this.currentSong?.id);
      this.player.togglePlay();
    },
    handleEndSong() {
      this.player.getCurrentState().then(result => {
            if (this.currentTrackMode === "artist") {
              this.songQueue.shift();
              const currSong = this.songQueue[0];
              this.setCurrentSongId(currSong.id)
              if (this.songQueue.length === 0) {
                return;
              }
            }
            this.setCurrentSongId(result.track_window?.current_track?.id)
          }
      );
    }
  },
  watch: {
    currentSongId(curr) {
      getSong(this.$cookies.get('access_token'), curr).then(response => {
        this.currentSong = response;
        this.play();
      });
    }
  }
}
</script>

<style scoped>
.info-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

img {
  max-width: 130px;
  max-height: 130px;
}

.bolded {
  font-weight: bold;
}

.text-container {
  max-width: 130px;
  max-height: 130px;
  overflow: hidden;
}

.text-container p {
  margin: 3px 0;
}

.skew {
  transform: rotateY(18deg);
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 15px;
  perspective: 500px;
}

.primary {
  font-size: .85rem;
  color: #3b3b3b;

}

.secondary {
  font-size: 0.85rem;
  color: #545454;
}

.full-width {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

</style>
