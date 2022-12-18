import { sentry } from ".";

export class SpotifyClient {

    private _authToken: string;
 
    constructor(authToken: string) {
        this._authToken = authToken;
    }

    async searchSongs(searchStrings: String[]): Promise<String[]> {        

        const url = "https://api.spotify.com/v1/search?limit=1&type=track"

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${this._authToken}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const strings = new Array();

        for (const element of searchStrings.slice(0,40)) {
            await fetch(`${url}&q=${encodeURIComponent(element.toString())}`, requestOptions)
                .then(response => response.json())
                .then(result => strings.push(result['tracks']['items'][0].uri))
                .catch(error => {
                    console.log('error', error);
                    sentry().captureException(error);
                });
        }

        return strings;
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

        fetch(`${url}`, requestOptions).catch(error => {
            console.log('error', error);
            sentry().captureException(error);
        });
    }
}
