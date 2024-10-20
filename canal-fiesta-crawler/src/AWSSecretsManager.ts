import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

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

export class AWSSecretsManager {
    private client = new SecretsManagerClient({
      region: "us-east-1",
    });

    async getSecret(): Promise<SpotifySecrets | undefined> {
        let response;
    
        try {
          response = await this.client.send(
            new GetSecretValueCommand({
              SecretId: "spotifyAuth"
            })
          );
        } catch (error) {
          // For a list of exceptions thrown, see
          // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
          throw error;
        }
        if (!response.SecretString) {
            return;
        }
        const json = JSON.parse(response.SecretString);
        const secrets = {...json};
        return new SpotifySecrets(secrets["CLIENT_ID"], secrets["CLIENT_SECRET"], secrets["REFRESH_TOKEN"]);
    }
}
