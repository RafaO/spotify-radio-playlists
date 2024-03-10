import Logger from "js-logger";

export class SpotifyClient {

    private _authToken: String;

    constructor(authToken: String) {
        this._authToken = authToken;
    }

    async searchSong(searchString: string): Promise<string> {
        const url = "https://api.spotify.com/v1/search?limit=1&type=track";

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${this._authToken}`);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${url}&q=${encodeURIComponent(searchString)}`, requestOptions);
            const result = await response.json();
            return result['tracks']['items'][0].uri;
        } catch (error) {
            Logger.error(error);
            throw error; // Rethrow the error to propagate it to the caller
        }
    }

    async addSongsToPlaylist(songsIds: String) {
        const canalFiestaPlaylistUri = "1o5FGy6wRTST1kinYXq9e0";

        const url = `https://api.spotify.com/v1/playlists/${canalFiestaPlaylistUri}/tracks?uris=${songsIds}`

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${this._authToken}`);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            redirect: 'follow',
            body: JSON.stringify({
                "range_start": 0,
                "range_length": songsIds.length
            })
        };

        try {
            const result = await fetch(`${url}`, requestOptions);
            Logger.debug(`spotify api added songs status code: ${result.status}`);
        } catch (error) {
            Logger.error(error);
        }
    }
}
