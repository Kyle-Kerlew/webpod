import {defineStore} from "pinia";
import {PLAYER_STATE} from "@/constants/PlayerState";

export const usePlayerStore = defineStore('main', {
    state: () => {
        return {
            playerState: PLAYER_STATE.PAUSED,
            songQueue: [],
            currentSongIndex: 0,
            currentSong: {},
        }
    },
    actions: {
        addToQueue(array) {
            this.songQueue.push(...array);
        },
        skipSong() {
            if (this.currentSongIndex === this.songQueue.length - 1) {
                return;
            }
            this.currentSong = this.songQueue[this.currentSongIndex + 1];
            this.currentSongIndex++;
        },
        nextSong() {
            this.skipSong();
        },
        setPlaying() {
            this.playerState = PLAYER_STATE.PLAYING;
        },
        setCurrentSong(song) {
            this.currentSong = song;
        },
        setPaused() {
            this.playerState = PLAYER_STATE.PAUSED;
        },
        previousSong() {
            if (this.currentSongIndex === 0) {
                return;
            }
            this.currentSong = this.songQueue[this.currentSongIndex - 1];
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
