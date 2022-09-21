import {MAIN_OPTIONS, MUSIC_OPTIONS, SETTING_OPTIONS} from "@/data/Options";

export const SCREENS = {
    HOME: {
        isFullscreen: false,
        name: "HOME",
        isSongSelection: false,
        options: MAIN_OPTIONS,
    },
    SETTINGS: {
        isFullscreen: false,
        name: "SETTINGS",
        isSongSelection: false,
        options: SETTING_OPTIONS,
    },
    MUSIC: {
        name: "MUSIC",
        isFullscreen: false,
        isSongSelection: false,
        options: MUSIC_OPTIONS
    },
    ARTISTS: {
        name: "ARTISTS",
        isFullscreen: true,
        isSongSelection: false,
        options: {}
    },
    ALBUMS: {
        name: "ALBUMS",
        isFullscreen: true,
        isSongSelection: false,
        options: []
    },
    SONG_SELECT: {
        name: "SONG_SELECT",
        isFullscreen: true,
        isSongSelection: false,
    },
    MUSIC_PLAYER: {
        name: "MUSIC_PLAYER",
        isFullscreen: false,
        isSongSelection: true,
    }

}
