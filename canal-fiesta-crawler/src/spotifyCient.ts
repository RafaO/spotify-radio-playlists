export class SpotifyClient {

    private _authToken: string;
    private _url: string = "https://api.spotify.com/v1/search?limit=1&type=track";
 
    constructor(authToken: string) {
        this._authToken = authToken;
    }

    async searchSongs(searchStrings: String[]) {        

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${this._authToken}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        searchStrings.forEach((element: String) => {
            fetch(`${this._url}&q=${encodeURIComponent(element.toString())}`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        });
    }
}
