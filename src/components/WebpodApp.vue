<template>
  <PopupSelection v-if="!this.$cookies.get('access_token')"/>
  <div class="container">
    <div class="webpod-border">
      <div class="screen-border">
        <MusicPlayer v-if="this.screen.isSongSelection" :currentTrackMode="this.getSelectionType()"/>
        <div v-else
             :class="{'full-width-content-container': this.screen.isFullscreen, 'split-content-container': !this.screen.isFullscreen}">
          <div :class="{'left-content':!this.screen.isFullscreen}">
            <WebPodBanner/>
            <OptionSelection :screen="this.screen" :hideArtist="this.hideArtist" v-slot="props"
                             :selectedOption="this.selectOption">
              <div class="item">
                <p><strong>{{ this.getSongData(props) }}</strong></p>
                <p v-if="!props.hideArtist">{{ props.item.artists?.[0].name }}</p>
              </div>
            </OptionSelection>
          </div>
          <div v-if='!this.screen.isFullscreen' class="right-content">
            <ContentCarousel
                :type="this.getRightContentType(this.selectOption)"
                :options="this.getRightContent(this.selectOption)" v-slot="props">
              <div v-if="props.type === 'custom'" class="about-container">
                <div class="text-container">
                  <p>Made using</p>
                  <div class="row">
                    <img src="../assets/png/vuejs.png" alt="Vue Logo" width="16" height="16"/>
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
      <PlayerControls
          @back="this.stack.pop()"
          @forward="this.stack.push($event)"
          @select="this.selectOption = $event"
          @screen="this.screen = $event"
          :stack="this.stack"
          :screen="this.screen"
          :select-option="this.selectOption"
      />
    </div>
  </div>
</template>

<script>

import OptionSelection from "@/components/OptionSelection.vue";
import {MAIN_OPTIONS, MUSIC_OPTIONS, SETTING_OPTIONS} from "@/data/Options";
import ContentCarousel from "@/components/ContentCarousel.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";
import {SCREENS} from "@/data/Screens";
import {usePlayerStore} from '@/store';
import {mapActions} from "pinia";
import PopupSelection from "@/components/PopupSelection.vue";
import {getAlbums, transferPlayBack} from "@/service/PlayerService";
import {reauthenticate} from "@/service/AuthService";
import WebPodBanner from "@/components/WebPodBanner.vue";
import PlayerControls from "@/components/PlayerControls.vue";

export default {
  name: 'WebpodApp',
  components: {
    PlayerControls,
    WebPodBanner,
    PopupSelection,
    MusicPlayer,
    ContentCarousel,
    OptionSelection,
  },
  data() {
    return {
      selectOption: MAIN_OPTIONS.MUSIC,
      currentTrackMode: undefined,
      screen: SCREENS.HOME,
      albumImages: undefined,
      player: undefined,
      stack: []
    }
  },
  computed: {
    hideArtist() {
      return false;
    },
  },
  mounted() {
    this.setToSpotifyMode();
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      let accessCount = 1;
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => {
          cb(this.$cookies.get('access_token'));
          if (accessCount > 1) {
            reauthenticate().then(() => {
              this.setToken(this.$cookies.get('access_token'))
            });
            accessCount = 1;
          } else {
            accessCount++;
          }
        },
        volume: 0.5
      });

      this.player = player;
      this.setPlayer(player);
      player.addListener('ready', async ({device_id}) => {
        let response = await transferPlayBack(device_id, this.$cookies.get('access_token'))
        let count = 1;
        while (!response.ok && count < 5) {
          response = await transferPlayBack(device_id, this.$cookies.get('access_token'));
          count++;
        }
        this.setDeviceId(device_id);
        getAlbums(this.$cookies.get('access_token')).then(result => {
          this.albumImages = result.items.map(i => i.album.images[1].url);
        });
      });

      player.connect();
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['setCurrentSongId', 'setToken', 'setPlayer', 'setToSpotifyMode', 'setDeviceId']),
    getSelectionType() {
      //last two pages are music_player and song_select
      const lastPage = this.stack[this.stack.length - 3];
      return lastPage.name === SCREENS.ALBUMS.name ? "album" : "artist";
    },
    getSongData(props) {
      if (this.screen?.name === SCREENS.ALBUMS.name) {
        return props.item.name;
      }
      if (this.screen?.name === SCREENS.ARTISTS.name) {
        return props.item.name;
      }
      if (this.screen?.name === SCREENS.ARTISTS.name) {
        return props.item.title;
      }
      if (this.screen?.name === SCREENS.SONG_SELECT.name) {
        return props.item.name;
      }
    },

    getRightContentType(selectOption) {
      const selected = MAIN_OPTIONS[selectOption] || selectOption;
      let result = undefined;
      if (selected === MAIN_OPTIONS.MUSIC || selected === MAIN_OPTIONS.SETTINGS || selected === MUSIC_OPTIONS.ALBUMS || selected === MUSIC_OPTIONS.ARTISTS) {
        result = 'img';
      }
      if (selected === SETTING_OPTIONS.ABOUT) {
        result = 'custom';
      }
      return result;
    },
    getRightContent(selectOption) {
      const selected = MAIN_OPTIONS[selectOption] || selectOption;
      let result = undefined;
      if (selected === MAIN_OPTIONS.MUSIC || selected === MUSIC_OPTIONS.ARTISTS || selected === MUSIC_OPTIONS.ALBUMS) {
        const images = this.albumImages
        result = images ? Object.values(images) : undefined;
      }

      if (selected === MAIN_OPTIONS.SETTINGS) {
        result = Object.values(Object.freeze({SETTING: import('../assets/svg/gears.svg')}));
      }

      return result;
    },

  }
}
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  max-height: 592px;
  box-shadow: black 0 0 2.4em inset;
  background: linear-gradient(rgb(125, 124, 125) 0%, rgb(20, 19, 19) 100%);
  -webkit-box-reflect: below 0px -webkit-gradient(linear, 0% 0%, 0% 100%, from(transparent), color-stop(0.5, transparent), to(rgba(250, 250, 250, 0.3)));
  animation: 1.5s ease 0s 1 normal none running descend;
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

.screen-border {
  width: 85%;
  margin-top: 20px;
  border: 5px black solid;
  border-radius: 10px;
  overflow: hidden;
  height: 230px;
}

.right-content {
  display: flex;
}

.right-content > img {
  max-width: 100%;
  height: 100%;
  border-radius: 10px;
}

.about-container {
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  justify-content: center;
}

.full-width-content-container {
  width: 100%;
  background-color: white;
  height: 230px;
}

.full-width-content-container > * {
  height: 100%;
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

.text-container p {
  color: white;
  font-size: 1.5rem;
  margin: unset;
}

</style>
