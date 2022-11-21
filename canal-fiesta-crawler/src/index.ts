import { CanalFiestaScraper } from "./scrapper";
import { SpotifyClient } from "./spotifyCient";
import { SpotifyAuth } from "./spotifyAuth";

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
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
}

export default {
	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext
	): Promise<void> {

		const spotifyAuth = new SpotifyAuth(env.REFRESH_TOKEN, env.CLIENT_ID, env.CLIENT_SECRET);
		const code = await spotifyAuth.getAccessToken();
		
		const scraper = new CanalFiestaScraper();
		const searchStrings = await scraper.scrapeList("https://www.canalsur.es/radio/programas/cuenta-atras/noticia/1305888.html");

		const spotifyApi = new SpotifyClient(code);
		await spotifyApi.searchSongs(searchStrings);
	},
};
