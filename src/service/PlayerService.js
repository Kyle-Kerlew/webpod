export const transferPlayBack = async (deviceId, token) => {
    if (!deviceId || !token) {
        return;
    }
    const request = {
        device_ids: [deviceId],
        play: false
    }
    const authHeader = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': "application/json"
    }
    return fetch("https://api.spotify.com/v1/me/player", {method: "PUT", body: JSON.stringify(request), headers: authHeader})
}
export const getAlbums = async (token, limit = 50) => {
    const authHeader = {
        'Authorization': `Bearer ${token}`,
    }
    return (await fetch("https://api.spotify.com/v1/me/albums", {method: "GET", headers: authHeader})).json()
}
export const getFollowedArtists = async (token, limit = 50) => {
    const authHeader = {
        'Authorization': `Bearer ${token}`,
    }
    return (await fetch("https://api.spotify.com/v1/me/following?type=artist", {method: "GET", headers: authHeader})).json()
}

export const getTracksForAlbum = async (token, albumId) => {
    const authHeader = {
        'Authorization': `Bearer ${token}`,
    }
    return (await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {method: "GET", headers: authHeader})).json()
}

export const getTopTracksForArtist = async (token, artistId) => {
    const authHeader = {
        'Authorization': `Bearer ${token}`,
    }
    return (await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {method: "GET", headers: authHeader})).json()
}
export const getSong = async (token, songId) => {
    const authHeader = {
        'Authorization': `Bearer ${token}`,
    }
    return (await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {method: "GET", headers: authHeader})).json()
}
export const playSong = async (deviceId, token, songId) => {
    const authHeader = {
        'Authorization': `Bearer ${token}`,
    }
    const body = JSON.stringify({
        uris: [`spotify:track:${songId}`]
    });
    return (await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {method: "PUT", body: body, headers: authHeader})).json()
}
export const queueAndPlay = async (deviceId, token, uri, trackOffset) => {
    const authHeader = {
        'Authorization': `Bearer ${token}`,
    }
    const body = JSON.stringify({
        context_uri: uri,
        offset: trackOffset && {
            position: trackOffset
        }
    });
    return (await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {method: "PUT", body: body, headers: authHeader})).json()
}
