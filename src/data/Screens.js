import {MAIN_OPTIONS, MUSIC_OPTIONS, SETTING_OPTIONS} from "@/data/Options";
import {SONG_DATA} from "@/data/PlayerData";

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
        options: Object.values(SONG_DATA)
    },
    ALBUMS: {
        name: "ALBUMS",
        isFullscreen: true,
        isSongSelection: false,
        options: Object.values(SONG_DATA)
    },
    SHUFFLE: {
        name: "SHUFFLE",
        isFullscreen: true,
        isSongSelection: true,
        // options: new Set(Object.values(SONG_DATA).map(obj => obj.artist))
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
