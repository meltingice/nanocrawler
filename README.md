# Nano Node Dashboard

A lightweight web UI for viewing realtime information about your Nano node and exploring the Nano network.

## What is Nano?

Nano's goal is to become "a global currency with instantaneous transactions and zero fees over a secure, decentralized network." More information is available over on the official [Nano repository](https://github.com/nanocurrency/raiblocks).

## Installation

First, clone this repository onto the server where you intend to host the site. It doesn't have to be the same server as the Nano node, but it certainly can be if you want to.

Once the project is cloned, there are 2 config files you need to update.

### API Server Config

The server is responsible for proxying requests between the site and your Nano node. You should never expose your Nano node RPC to the public, which is why we have a server that exposes only certain endpoints. It also does a little processing on the raw response from the Nano RPC.

The server config file is in the project root and is named `server-config.json`. Edit this so that it reflects your setup:

* `account`: This is the Nano account address of your representative node.
* `nodeHost`: This is the address and port where your Nano node RPC can be reached.
* `serverPort`: The port that the API server will listen on. Defaults to 3001.
* `redis`: (optional) The address of your Redis server, which can be used to cache responses and reduce the load on your Nano node RPC. If you don't plan on running a Redis server, remove this config item completely.

### Client Config

The web front-end needs to know where the API server can be reached. Edit `public/client-config.json` to match your setup.

* `server`: The URL where the API server can be reached.

### Building and Running

Once the config has been set, you can build the project.

```bash
npm i
npm run build
```

This will compile and output all of the static site files into the `build` directory. From here, you can host the static site files anywhere. It can be on a home server, [Heroku](https://github.com/mars/create-react-app-buildpack), a DigitalOcean droplet, etc. I don't recommend this for production setups, but if you want a quick and dirty way to host the site, especially for testing, you can run (in the project directory):

```
npm i -g serve
serve -s build
```

This will start up a static webserver and it will tell you where you can reach the site. Note that this only handles serving the front-end files. You still need to run the API server. You can do so by running:

```
npm run server

# or alternatively

node server.js
```

Now, if all goes well, you should be able to view the site in your browser!
