import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { ISecretsManager, SpotifySecrets } from "../ISecretsManager";

export class AWSSecretsManager implements ISecretsManager {
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
