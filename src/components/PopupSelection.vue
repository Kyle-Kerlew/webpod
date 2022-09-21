<template>
  <div class="background-container">
    <div class="selection-container">
      <p> This application requires Spotify Premium to be able to play music. You can view a demo video of the app or continue </p>
      <div class="selections">
        <button @click="this.handleSpotifySelection">Continue</button>
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
  methods: {
    ...mapActions(usePlayerStore, ['setToDemoMode', 'setToSpotifyMode', "setToken"]),
    handleSpotifySelection() {
      this.setToSpotifyMode();

      const scope = "streaming \
               user-read-email \
               user-read-private \
               user-library-read \
               user-follow-read \
               user-read-playback-state \
               user-read-currently-playing"

      const state = this.generateRandomString(16);

      const auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: "http://localhost:3000/auth/callback",
        state: state
      })
      window.location = 'https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString();
    },
    handleDemoSelection() {
      window.location = "www.google.com";
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
  padding: 2rem;
  box-shadow: black 0 0 5px 0;
  inset: 0;
  height: fit-content;
  margin: auto;
  background-color: white;
}

.selection-container > p {
  text-align: center;
  margin-top: 0;
}

.selections {
  display: flex;
  justify-content: center;
  padding: 0 20%;
  gap: 15px;
}

.selections > button {
  height: 3rem;
  width: 100%;
}
</style>
