# NanoCrawler

A lightweight web UI for viewing realtime information about your Nano node and exploring the Nano network.

## What is Nano?

Nano's goal is to become "a global currency with instantaneous transactions and zero fees over a secure, decentralized network." More information is available over on the official [Nano repository](https://github.com/nanocurrency/raiblocks).

## Installation

First, clone this repository onto the server where you intend to host the site. It doesn't have to be the same server as the Nano node, but it certainly can be if you want to.

Run `yarn` to install dependencies.

There are 2 config files you need to update.

### API Server Config

The server is responsible for proxying requests between the site and your Nano node. You should never expose your Nano node RPC to the public, which is why we have a server that exposes only certain endpoints. It also does a little processing on the raw response from the Nano RPC and caches responses with Redis.

There is a full default config available in the examples folder. Copy `server-config.json` to the project root. Update all of the values to fit your environment.

**Redis support is optional, but recommended.** If you wish to skip it, you can safely delete the config entry.

### Client Config

The web front-end needs to know where the API server can be reached. Copy `client-config.json` from the examples into the `src` folder and update the config file to fit your environment.

The [websocket server](https://github.com/meltingice/nanovault-ws) is optional, but you're welcome to use the hosted websocket server that's set as the default in the config. Depending on the sync status of your node, you may receive blocks from the websocket server before your node confirms them, which is why hosting one yourself is ideal. Remove the config entry to disable the websocket altogether.

## Development

To run NanoCrawler in development mode, simply run `yarn start`. This will start both the API server and the webpack development server for the front-end. This does not start any of the reoccuring jobs, but can you run those manually if you need the data they provide (see below).

## Production Hosting

Once the config has been set, you can build the project with `yarn deploy`.

This will compile and output all of the static site files into the `html` directory. This is preferred over using `yarn build` because the build process starts by deleting the build directory, which can cause the site to break for any visitors during the build process. Any time you change the client config or pull down any changes from git, you will need to rebuild the project. From here, you can host the static site files anywhere. It can be on a home server, [Heroku](https://github.com/mars/create-react-app-buildpack), a DigitalOcean droplet, etc. If you're not on Heroku, I highly recommend hosting the static files with Nginx.

One important thing to note is that all of the site routing is done client-side. This means you need to do one of two things: either configure your web server to always serve `index.html` regardless of the URL path, or switch to hash-based routing.

**Example Nginx config**

```nginx
server {
  root /path/to/build_dir;

  index index.html;
  server_name nano.yourdomain.com;

  # This is the important part that will fallback to loading index.html
  location / {
    try_files $uri $uri/ /index.html =404;
  }
}
```

**Switching to hash-based router**

While I highly recommend hosting via a proper webserver, as a last resort you can switch to hash-based routing. Open up `src/index.js` and change `BrowserRouter` to `HashRouter`. Run `yarn build` to get an updated version of the site. Now instead of `/explorer` the URL will be `/#explorer`.

### Hosting the Server

The server-side components are broken up into multiple processes in order to separate the API server from some long-running reoccurring jobs. They're comprised of:

- `server.api.js` - the API server
- `server.peers.js` - reoccurring job for discovering and fetching data from other Nano monitors
- `server.top-accounts.js` - reoccurring job for building the top accounts list
- `server.tps.js` - reoccurring job for recording the current block count to calculate blocks/sec

There are multiple options for hosting a NodeJS server. If you have experience with one option, feel free to use it. All of the scripts can be run directly with `node` and they all use the same `server-config.json`.

I use and recommend [PM2](https://www.npmjs.com/package/pm2) for managing NodeJS servers. There is an `ecosystem.config.js` file included so all you have to do is run `pm2 start ecosystem.config.js --env production` to start all the processes. The API server will start in cluster mode with 4 processes by default. Feel free to tweak this in the `ecosystem.config.js` file.

## Localization

NanoCrawler aims to be available in as many languages as possible. If you would like to contribute translations, please see the instructions below and send a Pull Request when ready.

### Contributing Translations

All strings that are used on the site are defined in the translations files in `src/translations/`. These translation files consist of a simple JSON object. The keys are the stable IDs for each of the strings, which are used in the site code. The values are the corresponding translation. If a string contains a value between two brackets, e.g. `{count}`, that is a dynamic value that is populated in the code. It should be present, as is, in all available translations.

English is the fallback language for NanoCrawler if a particular translation is not present.

To contribute to NanoCrawler's translations, please email meltingice (see Github profile) to get an invite to our [POEditor](https://poeditor.com/) project. While discouraged, we will accept pull requests with translation updates as well.
