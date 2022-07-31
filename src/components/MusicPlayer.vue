<template>
  <div v-if="this.currentSong" class="container">
    <div class="row">
      <img class='skew' :src="this.currentSong?.album?.images?.[0].url" alt="Album Photo"/>
      <div class="text-container">
        <div class="primary">
          <p class="bolded">{{ this.currentSong?.name }}</p>
          <p>{{ this.currentSong?.album.name }}</p>
        </div>
        <div class="secondary">
          <p>{{ this.currentSong?.artists.map(artist => artist.name).join(", ") }}</p>
          <p>{{ `${this.currentSong?.track_number} of ${this.currentSong?.album.total_tracks}` }}</p>
        </div>
      </div>
    </div>
    <div class="row full-width">
      <SongProgress :current-song="this.currentSong" @end-song="this.$emit('end-song')"/>
    </div>
  </div>
</template>

<script>
import SongProgress from "@/components/SongProgress";
import {mapState} from "pinia";
import {usePlayerStore} from "@/store";
import {getSong, playSong, queueAndPlay, queueAndPlayAlbum} from "@/service/PlayerService";

export default {
  name: "MusicPlayer",
  components: {SongProgress},
  props: {
    selectionTypeCallback: Function,
  },
  data() {
    return {
      currentSong: undefined,
    }
  },
  computed: {
    ...(mapState(usePlayerStore, ['token', 'currentSongId', 'deviceId', 'player'])),
  },
  mounted() {
    if (!this.currentSong) {
      getSong(this.$cookies.get('access_token'), this.currentSongId).then(response => {
        this.currentSong = response;
        this.play();
      });
    }
  },
  methods: {
    play() {
      if (this.selectionTypeCallback() === "album") {
        queueAndPlay(this.deviceId, this.$cookies.get('access_token'), this.currentSong?.album?.uri, this.currentSong?.track_number - 1)
      } else {
        queueAndPlay(this.deviceId, this.$cookies.get('access_token'), this.currentSong?.artists[0]?.uri);
      }
    }
  },
  watch: {
    currentSongId(curr, prev) {
      getSong(this.$cookies.get('access_token'), curr).then(response => this.currentSong = response);
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

img {
  max-width: 120px;
  max-height: 120px;
}

.bolded {
  font-weight: bold;
}

.text-container p {
  margin: 3px 0;
}

.primary {

}

.skew {
  transform: rotateY(18deg)
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 15px 0;
  width: 100%;
  height: 100%;
  perspective: 500px;
}

</style>
