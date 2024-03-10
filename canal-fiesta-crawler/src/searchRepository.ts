import Logger from "js-logger";
import { SpotifyClient } from "./spotifyCient";

export class SearchRepository {
    private spotifyClient: SpotifyClient;
    private kv: KVNamespace;

    constructor(spotifyClient: SpotifyClient, kv: KVNamespace) {
        this.spotifyClient = spotifyClient;
        this.kv = kv;
    }

    async getSongIds(searchStrings: string[]): Promise<string[]> {
        const strings = new Array();
        for (const searchString of searchStrings) {
            let songId = await this.getSongId(searchString);
            strings.push(songId);
        }

        return strings;
    }

    async getSongId(searchString: string): Promise<string | null> {
        let songId: string | null = null;

        // Try to retrieve song ID from Cloudflare KV
        try {
            songId = await this.kv.get(searchString);
            if (songId) {
                Logger.debug(`Song ID "${songId}" found in Cloudflare KV for search string "${searchString}"`);
                return songId;
            }
        } catch (error) {
            Logger.error(`Error retrieving song ID from Cloudflare KV for search string "${searchString}":`, error);
        }

        // If song ID not found in Cloudflare KV, retrieve from Spotify API
        try {
            songId = await this.spotifyClient.searchSong(searchString);
            await this.kv.put(searchString, songId);
            Logger.debug(`Song ID "${songId}" retrieved from Spotify API for search string "${searchString}"`);
        } catch (error) {
            Logger.error(`Error retrieving song ID from Spotify API for search string "${searchString}":`, error);
        }

        if (!songId) {
            throw new Error(`Song ID not found for search string "${searchString}"`);
        }

        return songId;
    }
}
