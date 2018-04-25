import { Nano } from "nanode";
import express from "express";
import cors from "cors";

import config from "../server-config.json";

import startNetworkDataUpdates from "./nanoNodeMonitorPeers";
if (config.networkUpdatesEnabled) startNetworkDataUpdates();

const app = express();
const nano = new Nano({ url: config.nodeHost });

app.use(cors());

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

require("./server/responders/accounts").default(app, nano);
require("./server/responders/api").default(app, nano);
require("./server/responders/blocks").default(app, nano);
require("./server/responders/network").default(app, nano);
require("./server/responders/peers").default(app, nano);
require("./server/responders/representatives").default(app, nano);
require("./server/responders/system").default(app, nano);

app.get("/", (req, res) => {
  res.redirect(config.clientUrl);
});

app.listen(config.serverPort || 3001);
