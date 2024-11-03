import Logger from "js-logger";

interface AccessTokenResponse {
    access_token: string;
}

export class SpotifyAuth {

    private _refreshToken: string;
    private _clientId: string;
    private _clientSecret: string;
 
    constructor(refreshToken: string, clientId: string, clientSecret: string) {
        this._refreshToken = refreshToken;
        this._clientId = clientId;
        this._clientSecret = clientSecret;
    }

    async getAccessToken(): Promise<string | null> {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
		
		var urlencoded = new URLSearchParams();
		urlencoded.append("refresh_token", this._refreshToken);
		urlencoded.append("grant_type", "refresh_token");
		urlencoded.append("client_id", this._clientId);
		urlencoded.append("client_secret", this._clientSecret);
		
		var requestOptions: RequestInit = {
		  method: 'POST',
		  headers: myHeaders,
		  body: urlencoded,
		  redirect: 'follow'
		};

        try {
            Logger.debug("getting access token");
            const response = await (await fetch("https://accounts.spotify.com/api/token", requestOptions)).json() as AccessTokenResponse;
            return response['access_token'];
        } catch (e) {
            Logger.error(e);
            return null;
        }
    }
}
