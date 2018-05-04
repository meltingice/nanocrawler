# Nano Node Dashboard

A lightweight web UI for viewing realtime information about your Nano node and exploring the Nano network.

## What is Nano?

Nano's goal is to become "a global currency with instantaneous transactions and zero fees over a secure, decentralized network." More information is available over on the official [Nano repository](https://github.com/nanocurrency/raiblocks).

## Installation

First, clone this repository onto the server where you intend to host the site. It doesn't have to be the same server as the Nano node, but it certainly can be if you want to.

Once the project is cloned, there are 2 config files you need to update.

### API Server Config

The server is responsible for proxying requests between the site and your Nano node. You should never expose your Nano node RPC to the public, which is why we have a server that exposes only certain endpoints. It also does a little processing on the raw response from the Nano RPC and caches responses with Redis.

There is a full default config available in the project root. Copy `server-config.sample.json` to `server-config.json`. Update all of the values to fit your environment.

Redis support is optional, but recommended. If you wish to skip it, you can safely delete the config entry.

`networkUpdatesEnabled` toggles whether or not the server will attempt to discover [nanoNodeMonitor](https://github.com/NanoTools/nanoNodeMonitor) compatible monitor APIs via the list of peers connected to the Nano node (and any hardcoded via the `knownMonitors` config setting). This will generate a bunch of extra traffic, so if you're hosting on a site with limited bandwidth, I'd recommend leaving this off. It also requires Redis to be connected.

### Client Config

The web front-end needs to know where the API server can be reached. Copy `public/client-config.sample.json` to `public/client-config.json` and update the config file to fit your environment.

The [websocket server](https://github.com/meltingice/nanovault-ws) is optional, but you're welcome to use the hosted websocket server that's set as the default in the config. Depending on the sync status of your node, you may receive blocks from the websocket server before your node confirms them, which is why hosting one yourself is ideal. Remove the config entry to disable the websocket altogether.

### Building and Hosting the Front-End

Once the config has been set, you can build the project.

```bash
npm i
npm run build
```

This will compile and output all of the static site files into the `build` directory. Any time you change the client config or pull down any changes from git, you will need to rebuild the project. From here, you can host the static site files anywhere. It can be on a home server, [Heroku](https://github.com/mars/create-react-app-buildpack), a DigitalOcean droplet, etc. If you're not on Heroku, I recommend hosting the static files with Nginx or Apache.

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

While I highly recommend hosting via a proper webserver, as a last resort you can switch to hash-based routing. Open up `src/index.js` and change `BrowserRouter` to `HashRouter`. Run `npm run build` to get an updated version of the site. Now instead of `/explorer` the URL will be like `/#explorer`.

### Hosting the Server

There are multiple options for hosting a NodeJS server. If you have experience with one option, feel free to use it. All you need to do is run `node server.js` to start the API server.

I use and recommend [PM2](https://www.npmjs.com/package/pm2) for managing NodeJS servers. If you also want to use it, getting up and running is as simple as:

```
npm i pm2 -g
pm2 start server.js --name "nano-api"
```

And if you want the API server to automatically start whenever the server reboots, you can run `pm2 startup`.
