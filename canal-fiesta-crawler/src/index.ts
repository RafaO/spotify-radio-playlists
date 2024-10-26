import { Handler } from 'aws-lambda';
import { CanalFiestaScraper } from "./scrapper";
import { SpotifyClient } from "./spotifyClient";
import { SpotifyAuth } from "./spotifyAuth";
import Logger from "js-logger";
import { initLogger } from "./logging";
import { SearchRepository } from "./searchRepository";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GenAIHelper } from "./genAIHelper";
import { AWSSecretsManager } from './aws/AWSSecretsManager';

const url = 'https://www.canalsur.es/radio/programas/cuenta-atras/noticia/1305888.html';

export const handler: Handler = async (event, context) => {
	initLogger(process.env.SENTRY_DSN || '', context);
	Logger.debug("worker starting");

	const secretsManager = new AWSSecretsManager();
	const spotifySecrets = await secretsManager.getSecret();

	if (!spotifySecrets) {
		throw new Error('error retrieving secrets');
	}

	Logger.debug("environment variables retrieved");
	const spotifyAuth = new SpotifyAuth(spotifySecrets.refresh_token, spotifySecrets.client_id, spotifySecrets.client_secret);
	const code = await spotifyAuth.getAccessToken();

	const genAIApiKey: string = "env.GEN_AI_API_KEY";
	const genAIScrapper: GenAIHelper = new GenAIHelper(new GoogleGenerativeAI(genAIApiKey));

	if (code != null) {
		Logger.debug("access token received");

		const scraper = new CanalFiestaScraper(genAIScrapper);
		const spotifyApi = new SpotifyClient(code);
		const searchRepository = new SearchRepository(spotifyApi, "env.SONG_IDS");

		const searchStrings = await scraper.scrapeList("https://www.canalsur.es/radio/programas/cuenta-atras/noticia/1305888.html");
		if (searchStrings.length != 50 ) {
			Logger.error("something went wrong scrapping the list");
			return;
		}
		Logger.debug("search strings received");
		Logger.debug(searchStrings);

		// await searchRepository.cleanUpKV(searchStrings);
		// Logger.debug("kv cleaned up");

		let songIds = await searchRepository.getSongIds(searchStrings);

		Logger.debug("song ids received");
		Logger.debug(songIds);

		await spotifyApi.addSongsToPlaylist(songIds.join(','));

		Logger.debug("songs added to playlist - finishing");
	} else {
		Logger.error("access code is null");
	}
};
