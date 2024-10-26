export interface ISecretsManager {
    getSecret(): Promise<SpotifySecrets | undefined>;
}

export class SpotifySecrets {
    client_id: string;
    client_secret: string;
    refresh_token: string;

    constructor(client_id: string, client_secret: string, refresh_token: string) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.refresh_token = refresh_token;
    }
}
