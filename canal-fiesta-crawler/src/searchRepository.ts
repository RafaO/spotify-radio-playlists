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
            let songId = await this.getSongId(searchString, false);
            strings.push(songId);
        }

        return strings;
    }

    async getSongId(searchString: string, useCache: boolean): Promise<string | null> {
        let songId: string | null = null;

        if (useCache) {
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
        }

        // If song ID not found in Cloudflare KV or cache not used, retrieve from Spotify API
        try {
            songId = await this.spotifyClient.searchSong(searchString);
            if (useCache)
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

    async cleanUpKV(keysToKeep: string[]): Promise<void> {
        const kvKeys = (await this.kv.list()).keys;

        const keysToDelete = kvKeys.filter(key => !keysToKeep.includes(key.name));
        Logger.debug(keysToDelete.map(key => key.name));

        await Promise.all(keysToDelete.map(key => this.kv.delete(key.name)));
    }
}
