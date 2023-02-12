# BassBot

Simple self-hosted Discord music bot which uses the YouTube API to deliver music through a Discord voice channel.

## Installation

```
git clone https://github.com/watzon/bassbot.git
cd bassbot
npm install
```

## Configuration

All configuration is handled through environment variables. To get started, copy `.env.example` to `.env`

```
cp .env.example .env
```

The `BOT_TOKEN` environment variable is required to run the bot. `CLIENT_ID` is also required if you want a URL to be generated that will allow you to add your bot to a server.

## Run It

To run the bot, just execute `npm run dev` in your terminal.
