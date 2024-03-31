import { CanalFiestaScraper } from "./scrapper";
import { SpotifyClient } from "./spotifyCient";
import { SpotifyAuth } from "./spotifyAuth";
import Logger from "js-logger";
import { initLogger } from "./logging";
import { SearchRepository } from "./searchRepository";

/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler publish --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	SONG_IDS: KVNamespace;
}

export default {
	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext
	): Promise<void> {

		initLogger(env.SENTRY_DSN, ctx);
		Logger.debug("worker starting");

		const spotifyAuth = new SpotifyAuth(env.REFRESH_TOKEN, env.CLIENT_ID, env.CLIENT_SECRET);
		const code = await spotifyAuth.getAccessToken();

		if (code != null) {
			Logger.debug("access token received");

			const scraper = new CanalFiestaScraper();
			const spotifyApi = new SpotifyClient(code);
			const searchRepository = new SearchRepository(spotifyApi, env.SONG_IDS);

			const searchStrings = await scraper.scrapeList("https://www.canalsur.es/radio/programas/cuenta-atras/noticia/1305888.html");
			if (searchStrings.length != 50 ) {
				Logger.error("something went wrong scrapping the list");
				return;
			}
			Logger.debug("search strings received");
			Logger.debug(searchStrings);

			await searchRepository.cleanUpKV(searchStrings);
			Logger.debug("kv cleaned up");

			let songIds = await searchRepository.getSongIds(searchStrings);

			Logger.debug("song ids received");
			Logger.debug(songIds);

			await spotifyApi.addSongsToPlaylist(songIds.join(','));

			Logger.debug("songs added to playlist - finishing");
		} else {
			Logger.error("access code is null");
		}
	},
};
