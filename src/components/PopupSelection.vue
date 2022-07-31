<template>
  <div class="background-container">
    <div class="selection-container">
      <p>This application can connect to your personal Spotify or can be put in demo mode. Demo mode can be interacted
        with but will not play audio.</p>
      <div class="selections">
        <button @click="this.handleSpotifySelection">Spotify</button>
        <button @click="this.handleDemoSelection">Demo</button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from "pinia/dist/pinia";
import {usePlayerStore} from "@/store";

export default {
  name: "PopupSelection",
  data() {
    return {
      token: undefined
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions(usePlayerStore, ['setToDemoMode', 'setToSpotifyMode', "setToken"]),
    handleSpotifySelection() {
      this.setToSpotifyMode();

      const scope = "streaming \
               user-read-email \
               user-read-private \
               user-library-read \
               user-follow-read \
               user-read-currently-playing"

      const state = this.generateRandomString(16);

      const auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: process.env.VUE_APP_SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: "http://localhost:3000/auth/callback",
        state: state
      })
      window.location = 'https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString();
    },
    handleDemoSelection() {
      this.setToDemoMode();
    },
    generateRandomString(length) {
      let text = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }

  }
}
</script>

<style scoped>
.background-container {
  position: fixed;
  width: 100%;
  z-index: 4;
  height: 100%;
  background-color: rgba(0, 0, 0, .75);
}

.selection-container {
  border-radius: 10px;
  position: fixed;
  border: 2px black solid;
  width: 300px;
  padding: 1rem 2rem;
  box-shadow: black 0 0 5px 0;
  height: 200px;
  inset: 0;
  margin: auto;
  background-color: white;
}

.selection-container > p {
  text-align: center;
}

.selections {
  display: flex;
  justify-content: space-between;
  width: 50%;
  margin: 0 auto;
}

.selections > button {
  width: 4rem;
  height: 3rem;
}
</style>
