# spotify-radio-playlists

App that extracts information about top 50 of Canal Fiesta radio and maintains a Spotify playlist.

There are different versions depending on where it's deployed:

- [Cloudflare](https://github.com/RafaO/spotify-radio-playlists/tree/Cloudflare): It executes a Cloudflare worker via a cron job weekly on Sundays.
- AWS: main branch

## Deploy

- cd canal-fiesta-crawler
- npm i
- npm run build
- go to aws console in the lambda and upload canal-fiesta-crawler/dist/index.zip (upload from)
