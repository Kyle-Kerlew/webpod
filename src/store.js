import {defineStore} from "pinia";
import {PlayerState} from "@/constants/PlayerState";
import {Mode} from "@/constants/PlayerMode";

export const usePlayerStore = defineStore('main', {
    state: () => {
        return {
            playerState: PlayerState.PAUSED,
            songQueue: [],
            player: undefined,
            currentSongIndex: 0,
            currentSongId: undefined,
            deviceId: undefined,
            mode: undefined,
            token: undefined
        }
    },
    actions: {
        setPlayer(player) {
            this.player = player;
        },
        setDeviceId(deviceId) {
            this.deviceId = deviceId
        },
        setToken(token) {
          this.token = token;
        },
        setToDemoMode() {
            this.mode = Mode.DEMO;
        },
        setToSpotifyMode() {
            this.mode = Mode.SPOTIFY;
        },
        addToQueue(array) {
            this.songQueue.push(...array);
        },
        clearQueue() {
            this.songQueue = [];
        },
        skipSong() {
            this.player.nextTrack().then(res => {
                this.setCurrentSongId(res.id);
            })
        },
        setPlaying() {
            this.playerState = PlayerState.PLAYING;
        },
        setCurrentSongId(songId) {
            this.currentSongId = songId;
        },
        setPaused() {
            this.playerState = PlayerState.PAUSED;
        },
        previousSong() {
            if (this.currentSongIndex === 0) {
                return;
            }
            this.currentSongId = this.songQueue[this.currentSongIndex - 1];
            this.currentSongIndex--;
        }
    }
});

export default {
    setup() {
        const store = usePlayerStore();
        return {
            store,
        }
    }
}
