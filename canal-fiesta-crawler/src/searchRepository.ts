import Logger from "js-logger";
import { SpotifyClient } from "./spotifyClient";
import { ICache } from "./ICache";

export class SearchRepository {
    private spotifyClient: SpotifyClient;
    private cache: ICache;

    constructor(spotifyClient: SpotifyClient, cache: ICache) {
        this.spotifyClient = spotifyClient;
        this.cache = cache;
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
            // Try to retrieve song ID from cache
            try {
                songId = await this.cache.get(searchString);
                if (songId) {
                    Logger.debug(`Song ID "${songId}" found in cache for search string "${searchString}"`);
                    return songId;
                }
            } catch (error) {
                Logger.error(`Error retrieving song ID from cache for search string "${searchString}":`, error);
            }
        }

        // If song ID not found in cache or cache not used, retrieve from Spotify API
        try {
            songId = await this.spotifyClient.searchSong(searchString) as string;
            if (useCache) await this.cache.put(searchString, songId);
            Logger.debug(`Song ID "${songId}" retrieved from Spotify API for search string "${searchString}"`);
        } catch (error) {
            Logger.error(`Error retrieving song ID from Spotify API for search string "${searchString}":`, error);
        }

        if (!songId) {
            throw new Error(`Song ID not found for search string "${searchString}"`);
        }

        return songId;
    }

    async cleanUpCache(keysToKeep: string[]): Promise<void> {
        const cacheKeys = await this.cache.list();

        const keysToDelete = cacheKeys.filter((key: { name: string; }) => !keysToKeep.includes(key.name));
        Logger.debug(keysToDelete.map((key: { name: string; }) => key.name));

        await Promise.all(keysToDelete.map((key: { name: string; }) => this.cache.delete(key.name)));
    }
}
