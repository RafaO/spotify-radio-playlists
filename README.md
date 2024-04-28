# spotify-radio-playlists

App that extracts information about top 50 of Canal Fiesta radio and maintains a Spotify playlist. It executes a Cloudflare worker via a cron job weekly on Sundays.

## Run locally

```
cd canal-fiesta-crawler
npx wrangler dev --test-scheduled
```

And then

`curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"`

## KV Cache

The worker uses a KV database as cache, in order to clean it, execute:

`wrangler kv:namespace delete --binding=SONG_IDS --preview`
