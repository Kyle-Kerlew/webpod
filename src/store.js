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
        nextSong() {
            this.currentSongIndex++;
        },
        handleEndSong() {
            if (this.songQueue.length === 0) {
                return;
            }
            this.currentSongIndex++;
            this.setCurrentSongId(this.songQueue[this.currentSongIndex].id)
        },
        setPlaying() {
            this.playerState = PlayerState.PLAYING;
        },
        setCurrentSongIndex(index) {
            this.currentSongIndex = index;
        },
        setCurrentSongId(songId) {
            this.currentSongId = songId;
        },
        setPaused() {
            this.playerState = PlayerState.PAUSED;
        },
        getCurrentSongIndex() {
            return this.currentSongIndex
        },
        previousSong() {
            if (this.currentSongIndex === 0) {
                return;
            }
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
