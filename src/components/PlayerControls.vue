<template>
  <div class="controls">
    <div class="outer-ring"
         @mousedown="this.handleClickOuterRing($event)"
         @mouseup="this.handleMouseup"
         @mouseleave="this.handleMouseup"
         @mousemove="this.handleMoveOuterRing($event)"
    >
      <div class="grid">
        <button class="button menu" @click="this.goBack">
          MENU
        </button>
        <button type="button" class="inner-button" @click="this.handleSelect"/>
        <button class="button previous" @click="this.handlePreviousSong">
          <img src="../assets/svg/prev.svg" alt="Previous Track" draggable="false"/>
        </button>
        <button class="button next" @click="this.handleNextSong">
          <img src="../assets/svg/next.svg" alt="Next Track" draggable="false"/>
        </button>
        <button class="button pause-play" @click="this.handlePausePlay">
          <img src="../assets/svg/pause.svg" alt="Pause/Play Track" draggable="false"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {SCREENS} from "@/data/Screens";
import {PlayerState} from "@/constants/PlayerState";
import {MAIN_OPTIONS, MUSIC_OPTIONS, SETTING_OPTIONS} from "@/data/Options";
import {SONG_DATA} from "@/data/PlayerData";
import {Mode} from "@/constants/PlayerMode";
import {
  getAlbums,
  getFollowedArtists,
  getTopTracksForArtist,
  getTracksForAlbum
} from "@/service/PlayerService";
import {mapActions, mapState} from "pinia";
import {usePlayerStore} from "@/store";

export default {
  name: "PlayerControls",
  props: {
    screen: Object,
    selectOption: [Object, String],
    stack: Array,
  },
  data() {
    return {
      mouseDown: false,
      step: 0,
    }
  },
  computed: {
    ...mapState(usePlayerStore, ['deviceId', 'songQueue', 'player', 'playerState'])
  },
  methods: {
    ...mapActions(usePlayerStore, ['skipSong', 'clearQueue', 'addToQueue', 'previousSong', 'setPlaying', 'setPaused', 'setCurrentSongId']),
    goBack() {
      if (!this.stack || this.stack.length === 1 && this.stack[0].name === SCREENS.HOME.name) {
        return;
      }
      this.$emit('back');
      this.$emit('screen', this.stack[this.stack.length - 1]);
      this.$emit('select', Object.values(this.stack[this.stack.length - 1].options)[0]);
    },
    async handleSelect() {
      if (this.stack.includes(this.selectOption)) {
        return;
      }
      if (this.stack.length === 0) {
        this.$emit('forward', SCREENS.HOME);
      }
      const screen = this.getScreenForSelection(this.selectOption);
      if (!screen) {
        return;
      }
      if (screen.name === SCREENS.MUSIC_PLAYER.name) {
        this.setCurrentSongId(this.selectOption.id);
        this.setPlaying();
        this.$emit('forward', screen);
        this.$emit('screen', screen);
        return;
      }
      screen.options = await this.getOptionsForSelection(this.selectOption, screen);
      this.$emit('forward', screen);
      this.$emit('screen', screen);
      this.$emit('select', Object.values(screen.options)[0]);
    },
    getScreenForSelection(selection) {

      if (selection === MAIN_OPTIONS.MUSIC) {
        return SCREENS.MUSIC;
      }
      if (selection === MAIN_OPTIONS.SETTINGS) {
        return SCREENS.SETTINGS;
      }
      if (selection === MUSIC_OPTIONS.ALBUMS) {
        return SCREENS.ALBUMS;
      }
      if (selection === MUSIC_OPTIONS.ARTISTS) {
        return SCREENS.ARTISTS;
      }
      if (typeof selection === 'object' && this.screen?.name === SCREENS.ALBUMS.name) {
        return SCREENS.SONG_SELECT;
      }
      if (typeof selection === 'object' && this.screen?.name === SCREENS.ARTISTS.name) {
        return SCREENS.SONG_SELECT;
      }
      if (this.stack[this.stack.length - 1].name === SCREENS.SONG_SELECT.name) {
        SCREENS.MUSIC_PLAYER.options = SCREENS.SONG_SELECT.options;
        return SCREENS.MUSIC_PLAYER;
      }
      return undefined;
    },
    getDemoOptionsForSelection(selection, screen) {
      if (screen.name === SCREENS.ALBUMS.name) {
        return Object.values(SONG_DATA).filter(song => song.album === selection.album);
      }
      if (screen.name === SCREENS.ARTISTS.name) {
        return Object.values(SONG_DATA).filter(song => song.artist === selection.album);
      }
    },
    async getOptionsForSelection(selection, screen) {
      if (this.mode === Mode.DEMO) {
        return this.getDemoOptionsForSelection(selection, screen);
      }
      if (screen.name === SCREENS.MUSIC.name) {
        return MUSIC_OPTIONS;
      }
      if (screen.name === SCREENS.SETTINGS.name) {
        return SETTING_OPTIONS;
      }
      if (screen.name === SCREENS.SONG_SELECT.name) {
        if (selection.type === "album") {
          return getTracksForAlbum(this.$cookies.get('access_token'), selection.id).then(response => {
            const tracks = response.items;
            this.clearQueue();
            this.addToQueue(tracks);
            return response.items;
          });
        }
        if (selection.type === "artist") {
          //TODO: Search for songs by artist instead?
          return getTopTracksForArtist(this.$cookies.get('access_token'), selection.id).then(response => {
            const tracks = response.tracks;
            this.clearQueue();
            this.addToQueue(tracks);
            return tracks;
          })
        }
        return SETTING_OPTIONS;
      }
      if (screen.name === SCREENS.ALBUMS.name) {
        return getAlbums(this.$cookies.get('access_token')).then(response => {
          return {...response.items.map(item => item.album)}
        });
      }
      if (screen.name === SCREENS.ARTISTS.name) {
        return getFollowedArtists(this.$cookies.get('access_token')).then(response => response.artists.items);
      }

      return [];
    },
    determineQuadrant(x, y, width, height) {
      if (0 <= x && x < width / 2) {
        return (height / 2) <= y && y < height ? 2 : 1;
      }
      if (width / 2 <= x && x < width) {
        return (height / 2) <= y && y <= height ? 3 : 4;
      }
    },
    handleMoveOuterRing(e) {
      if (!this.mouseDown) {
        return;
      }
      if (this.step < 20) {
        this.step++;
        return;
      }
      if (e.target.className !== 'grid') {
        return;
      }

      const keys = Object.values(this.screen.options);

      const movementX = e.movementX;
      const movementY = e.movementY;
      const quadrant = this.determineQuadrant(e.offsetX, e.offsetY, e.target.clientWidth, e.target.clientHeight);
      if (movementX < 0) {
        if (quadrant === 2 || quadrant === 3) {
          keys[keys.indexOf(this.selectOption) + 1] && this.$emit('select', keys[keys.indexOf(this.selectOption) + 1]);
        } else {
          keys[keys.indexOf(this.selectOption) - 1] && this.$emit('select', keys[keys.indexOf(this.selectOption) - 1]);
        }
        this.step = 0;
      } else if (movementX > 0) {
        if (quadrant === 2 || quadrant === 3) {
          keys[keys.indexOf(this.selectOption) - 1] && this.$emit('select', keys[keys.indexOf(this.selectOption) - 1]);
        } else {
          keys[keys.indexOf(this.selectOption) + 1] && this.$emit('select', keys[keys.indexOf(this.selectOption) + 1]);
        }
        this.step = 0;
      }

      if (movementY < 0) {
        if (quadrant === 1 || quadrant === 2) {
          keys[keys.indexOf(this.selectOption) + 1] && this.$emit('select', keys[keys.indexOf(this.selectOption) + 1]);
        } else {
          keys[keys.indexOf(this.selectOption) - 1] && this.$emit('select', keys[keys.indexOf(this.selectOption) - 1]);
        }
        this.step = 0;

      } else if (movementY > 0) {
        if (quadrant === 1 || quadrant === 2) {
          keys[keys.indexOf(this.selectOption) - 1] && this.$emit('select', keys[keys.indexOf(this.selectOption) - 1]);
        } else {
          keys[keys.indexOf(this.selectOption) + 1] && this.$emit('select', keys[keys.indexOf(this.selectOption) + 1]);
        }
        this.step = 0;
      }
    },
    handleClickOuterRing() {
      this.mouseDown = true;
    },
    handleMouseup() {
      this.mouseDown = false;
      this.prevX = undefined;
      this.prevY = undefined;
    },
    handlePausePlay() {
      if (this.playerState === PlayerState.PLAYING) {
        this.setPaused();
        this.player.pause();
      } else {
        this.setPlaying();
        this.player.resume();
      }
    },
    async handleNextSong() {
      const state = await this.player.getCurrentState();
      if (state.track_window?.next_track?.length > 0) {
        await this.player.nextTrack();
        this.setCurrentSongId(state.track_window?.current_track?.id);
        return;
      }
      this.songQueue.shift();
      if (this.songQueue.length > 0) {
        this.setCurrentSongId(this.songQueue[0].id)
      } else {
        //do nothing
      }
    },
    handlePreviousSong() {
      this.previousSong();
      this.player.previousTrack();

    }
  }
}
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: center;
  margin: 50px 0;
}

.grid {
  display: grid;
  grid-template-columns: 50px 100px 50px;
  grid-template-rows: 50px 100px 50px;
  grid-template-areas:
    "a b c"
    "d e f"
    "g h i"
}

.inner-button {
  grid-area: e;
  justify-self: center;
  align-self: center;
}

.pause-play {
  grid-area: h;
  justify-self: center;
  align-self: center;
}

.next {
  grid-area: f;
  justify-self: center;
  align-self: center;
}

.previous {
  grid-area: d;
  justify-self: center;
  align-self: center;
}

.menu {
  grid-area: b;
  justify-self: center;
  align-self: center;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}

.outer-ring {
  display: flex;
  align-items: center;
  background-color: black;
  height: 200px;
  width: 200px;
  border-radius: 50%;
}

.inner-button {
  color: white;
  width: 75px;
  border-width: 1px;
  height: 75px;
  border-radius: 50%;
  margin: 15px;
  background-color: rgba(111, 110, 110);
  opacity: 0.5;
  box-shadow: rgba(50, 50, 50) 0 1em 3em inset;
}

.inner-button:active {
  background: rgb(90, 90, 90);
}

.button {
  height: 40px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  background: transparent;
  border: none;
  color: white;
}
</style>
