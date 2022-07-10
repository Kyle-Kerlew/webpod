<template>
  <div class="container">
    <div class="webpod-border">
      <div class="screen-border">
        <div>
          <div v-if="this.screen.isFullscreen" class="full-width-content-container">
            <div class="screen-banner">
              <p>{{ this.banner }}</p>
            </div>
            <OptionSelection :screen="this.screen" :hideArtist="this.hideArtist" :custom="true" v-slot="props"
                             :selectedOption="this.selectOption"
                             :items="this.screen.options">
              <div class="item">
                <p><strong>{{ this.getSongData(props) }}</strong></p>
                <p v-if="!props.hideArtist">{{ props.artist }}</p>
              </div>
            </OptionSelection>
          </div>
          <div v-else-if="this.screen.isSongSelection">
            <div class="screen-banner">
              <p>{{ this.banner }}</p>
            </div>
            <MusicPlayer/>
          </div>
          <div v-else class="split-content-container">
            <div class="left-content">
              <div class="screen-banner">
                <p>{{ this.banner }}</p>
              </div>
              <OptionSelection @finish-animation="this.goingBack = false" :going-back="this.goingBack"
                               :selectedOption="this.selectOption" :items="this.screen.options"/>
            </div>
            <div class="right-content">
              <ContentCarousel :type="this.getRightContentType(this.selectOption)"
                               :options="this.getRightContent(this.selectOption)" v-slot="props">
                <div v-if="props.type === 'custom'" class="about-container">
                  <div class="text-container">
                    <p>Made using</p>
                    <div class="row">
                      <img src="../assets/png/vuejs.png" width="16" height="16"/>
                      <p>VueJS</p>
                    </div>
                  </div>
                  {{ props.item }}
                </div>
                <img :src="props.item"/>
              </ContentCarousel>
            </div>
          </div>
        </div>
      </div>
      <div class="controls">
        <div class="outer-ring" @mousedown="handleClickOuterRing($event)" @mouseup="handleMouseup"
             @mouseleave="handleMouseup"
             @mousemove="handleMoveOuterRing($event)">
          <div class="grid">
            <button class="button menu" @click="this.goBack">
              MENU
            </button>
            <button type="button" class="inner-button" @click="this.handleSelect"/>
            <button class="button previous" @click="this.previousSong">
              <img src="../assets/svg/prev.svg" alt="Previous Track" draggable="false"/>
            </button>
            <button class="button next" @click="this.nextSong">
              <img src="../assets/svg/next.svg" alt="Next Track" draggable="false"/>
            </button>
            <button class="button pause-play" @click="this.handlePausePlay">
              <img src="../assets/svg/pause.svg" alt="Pause/Play Track" draggable="false"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import OptionSelection from "@/components/OptionSelection";
import {MAIN_OPTIONS, MUSIC_OPTIONS, SETTING_OPTIONS} from "@/data/Options";
import {ALBUM_IMAGES} from "@/data/Albums";
import ContentCarousel from "@/components/ContentCarousel";
import {SONG_DATA} from "@/data/PlayerData";
import MusicPlayer from "@/components/MusicPlayer";
import {SCREENS} from "@/data/Screens";
import {usePlayerStore} from '@/store';
import {mapActions, mapState} from "pinia";
import {PLAYER_STATE} from "@/constants/PlayerState";

export default {
  name: 'WebpodApp',
  components: {
    MusicPlayer,
    ContentCarousel,
    OptionSelection,
  },
  data() {
    return {
      selectOption: MAIN_OPTIONS.MUSIC,
      screen: SCREENS.HOME,
      goingBack: false,
      banner: 'webpod.js',
      mouseDown: false,
      prevX: undefined,
      prevY: undefined,
      step: 0,
      stack: []
    }
  },
  computed: {
    ...mapState(usePlayerStore, ['currentSong', 'songQueue', 'playerState']),
    hideArtist() {
      return this.screen.name === SCREENS.ALBUMS.name;
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['addToQueue', 'skipSong', 'nextSong', 'previousSong', 'setPlaying', 'setCurrentSong', 'setPaused']),
    getSongData(props) {
      if (this.screen?.name === SCREENS.ALBUMS.name) {
        return props.item.album;
      }
      if (this.screen?.name === SCREENS.ARTISTS.name) {
        return props.item.artist;
      }
      if (this.screen?.name === SCREENS.ARTISTS.name) {
        return props.item.title;
      }
      if (this.screen?.name === SCREENS.SONG_SELECT.name) {
        return props.item.title;
      }
    },
    handlePausePlay() {
      if (this.playerState === PLAYER_STATE.PLAYING) {
        this.setPaused();
      } else {
        this.setPlaying();

      }
    },
    handleNextSong() {
      this.nextSong();
    },
    handlePreviousSong() {
      this.previousSong();
    },
    goBack() {
      if (!this.stack || this.stack.length === 1 && this.stack[0] === SCREENS.HOME) {
        return;
      }
      this.goingBack = true;
      this.stack.pop();
      this.screen = this.stack[this.stack.length - 1];
      this.selectOption = Object.values(this.screen.options)[0];
    },
    handleSelect() {
      if (this.stack.includes(this.selectOption)) {
        return;
      }
      if (this.stack.length === 0) {
        this.stack.push(SCREENS.HOME);
      }
      const screen = this.getScreenForSelection(this.selectOption);
      this.stack.push(screen);
      this.screen = screen;
      if (screen.options) {
        this.selectOption = Object.values(screen.options)[0];
      }
      if (screen.name === SCREENS.MUSIC_PLAYER.name) {
        //load queue into global state
        this.addToQueue(screen.options);
        this.setPlaying();
        this.setCurrentSong(this.selectOption);
      }

    },

    determineQuadrant(x, y) {
      //y increases downward
      //x increases toward the right

      // quadrant 1 field
      //125 <= x < 250
      //0 <= y <= 125

      //quadrant 2 field
      //0 <= x < 125
      //0 <= y <= 125

      // quadrant 3 field
      //0 <= x < 125
      //125 <= y < 250

      // quadrant 4 field
      //125 <= x < 250
      //125 <= y < 250

      //quadrant 2 or 3
      if (0 <= x && x < 125) {
        return 125 <= y && y < 250 ? 3 : 2;
      }
      //quadrant 1 or 4
      if (125 <= x && x < 250) {
        return 125 <= y && y <= 250 ? 4 : 1;
      }
    },
    handleMoveOuterRing(e) {
      if (!this.mouseDown || e.target.className === 'inner-button') {
        return;
      }
      if (this.prevX === undefined) {
        this.prevX = e.pageX;
        this.prevY = e.pageY;
        return;
      }
      const keys = Object.values(this.screen.options);

      //lowest pageX for the element seems to be 259, presumably because the element is centered in the screen
      //subtract 25 from the pageY to account for padding
      const quadrant = this.determineQuadrant(e.pageX - 109, e.pageY - 50 - 109);
      //counter clockwise if quadrant 1 or 2
      //moving from top to bottom
      if (this.step < 25) {
        this.step++;
        return;
      }
      if (this.prevY - e.pageY < 0) {
        if (quadrant === 2 || quadrant === 3) {
          this.selectOption = keys[keys.indexOf(this.selectOption) - 1] || keys[keys.length - 1];
        } else {
          this.selectOption = keys[keys.indexOf(this.selectOption) + 1] || keys[0];
        }
      } else if (this.prevY - e.pageY > 0) {
        if (quadrant === 2 || quadrant === 3) {
          this.selectOption = keys[keys.indexOf(this.selectOption) + 1] || keys[0];
        } else {
          this.selectOption = keys[keys.indexOf(this.selectOption) - 1] || keys[keys.length - 1];
        }
      }
      this.step = 0;
      this.prevX = e.pageX;
      this.prevY = e.pageY;
    },
    handleClickOuterRing() {
      this.mouseDown = true;
    },
    handleMouseup() {
      this.mouseDown = false;
      this.prevX = undefined;
      this.prevY = undefined;
    },
    getRightContentType(selectOption) {
      const selected = MAIN_OPTIONS[selectOption] || selectOption;
      let result = undefined;
      if (selected === MAIN_OPTIONS.MUSIC || selected === MAIN_OPTIONS.SETTINGS || selected === MUSIC_OPTIONS.ALBUMS || selected === MUSIC_OPTIONS.SHUFFLE || selected === MUSIC_OPTIONS.ARTISTS) {
        result = 'img';
      }
      if (selected === SETTING_OPTIONS.ABOUT) {
        result = 'custom'
      }
      return result;
    },
    getRightContent(selectOption) {
      const selected = MAIN_OPTIONS[selectOption] || selectOption;
      let result = undefined;
      if (selected === MAIN_OPTIONS.MUSIC || selected === MUSIC_OPTIONS.ARTISTS || selected === MUSIC_OPTIONS.SHUFFLE || selected === MUSIC_OPTIONS.ALBUMS) {
        result = Object.values(ALBUM_IMAGES);
      }

      if (selected === MAIN_OPTIONS.SETTINGS) {
        result = Object.values(Object.freeze({SETTING: require('../assets/svg/gears.svg')}));
      }
      return result;
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
      if (selection === MUSIC_OPTIONS.SHUFFLE) {
        return SCREENS.SHUFFLE;
      }
      if (typeof selection === 'object' && this.screen?.name === SCREENS.ALBUMS.name) {
        SCREENS.SONG_SELECT.options = Object.values(SONG_DATA).filter(song => song.album === selection.album);
        return SCREENS.SONG_SELECT;
      }
      if (typeof selection === 'object' && this.screen?.name === SCREENS.ARTISTS.name) {
        SCREENS.SONG_SELECT.options = Object.values(SONG_DATA).filter(song => song.artist === selection.artist);
        return SCREENS.SONG_SELECT;
      }
      SCREENS.MUSIC_PLAYER.options = SCREENS.SONG_SELECT.options;
      return SCREENS.MUSIC_PLAYER;
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
}

.split-content-container {
  display: flex;
  height: 230px;
}

.split-content-container > div {
  width: 50%;
}

.item > p {
  padding: unset;
  margin: 5px 0;
  font-weight: normal;
}

.webpod-border {
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 370px;
  height: 100%;
  box-shadow: black 0 0 2.4em inset;
  background: linear-gradient(rgb(125, 124, 125) 0%, rgb(20, 19, 19) 100%);
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

.left-content {
  display: flex;
  flex-direction: column;
  border-right: 1px solid black;
  box-shadow: 3px 0 5px black;
  z-index: 1; /* Shadow needs to be on top of image*/
  height: 230px;
  background-color: white;

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

.screen-banner {
  display: flex;
  justify-content: left;
  border-bottom: 1px solid black;
  background: linear-gradient(white 0%, gray 100%);
  height: 20px;
  padding-left: 5px;
}

.screen-banner > p {
  font-weight: bold;
  margin: unset;
}

.screen-border {
  width: 85%;
  margin-top: 20px;
  border: 3px black solid;
  border-radius: 10px;
  overflow: hidden;
  height: 230px;
  background-color: white;
}

.right-content {
  display: flex;
}

.right-content > img {
  max-width: 100%;
  height: 100%;
  border-radius: 10px;
}

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

.about-container {
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  justify-content: center;
}

.text-container {
  padding: 15px 7px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.full-width-content-container {
  width: 100%;
  background-color: white;
  height: 230px;
}

.text-container p {
  color: white;
  font-size: 1.5rem;
  margin: unset;
}

.text-container {

}
</style>
