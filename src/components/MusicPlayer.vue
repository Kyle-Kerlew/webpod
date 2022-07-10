<template>
  <div class="container">
    <div class="row">
      <img class='skew' :src="this.currentSong.image" alt="Album Photo"/>
      <div class="text-container">
        <div class="primary">
          <p class="bolded">{{ this.currentSong.title }}</p>
          <p>{{ this.currentSong.album }}</p>
        </div>
        <div class="secondary">
          <p>{{ this.currentSong.artist }}</p>
          <p>{{`${this.currentSong.song} of ${this.currentSong.totalSongs}`}}</p>
        </div>
      </div>
    </div>
    <div class="row full-width">
      <SongProgress @end-song="this.$emit('end-song')"/>
    </div>
  </div>
</template>

<script>
import SongProgress from "@/components/SongProgress";
import {mapState} from "pinia";
import {usePlayerStore} from "@/store";
export default {
  name: "MusicPlayer",
  components: {SongProgress},
  computed: {
    ...(mapState(usePlayerStore, ['currentSong']))
  },
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
  perspective: 500px;
}

</style>
