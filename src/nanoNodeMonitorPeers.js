import _ from "lodash";
import fetch from "node-fetch";
import redis from "redis";
import { Nano } from "nanode";
import parallel from "async/parallel";
import reflectAll from "async/reflectAll";
import asyncify from "async/asyncify";
import config from "../server-config.json";

import NodeMonitor from "./server/NodeMonitor";

const redisClient = redis.createClient(config.redis);
const nano = new Nano({ url: config.nodeHost });

const HARDCODED_MONITORS = [
  "https://nano-api.meltingice.net/api.php",
  "https://nano.nifni.net/api.php",
  "http://node.numberwitch.net/api.php",
  "http://nanode.blizznerds.com/nano/api.php",
  "http://78.233.80.228:8000/api.php",
  "http://nanotipbot.tk/nanoNodeMonitor/api.php",
  "https://nano-rep.xyz/api.php",
  "https://node.nanovault.io/api.php",
  "https://brainblocks.io/monitor/api.php",
  "http://207.148.8.82/api.php"
];

let KNOWN_MONITORS = [];

async function updateKnownMonitors() {
  let monitors = _.keys((await nano.rpc("peers")).peers).map(peer =>
    NodeMonitor.fromPeerAddress(peer)
  );

  monitors = _.uniqBy(
    monitors.concat(HARDCODED_MONITORS.map(url => new NodeMonitor(url))),
    "apiUrl"
  );

  try {
    const results = await parallel(
      reflectAll(monitors.map(monitor => monitor.fetch))
    );

    KNOWN_MONITORS = results.map(monitor => monitor.url);

    console.log(KNOWN_MONITORS);
  } catch (e) {
    console.log(e.stack);
  }
}

// async function updateKnownMonitors() {
//   console.log("Updating our list of known nanoNodeMonitors");

//   const peers = _.keys((await nano.rpc("peers")).peers);
//   const data = await getDataFromPeers(peers);

//   KNOWN_MONITORS = _.uniqBy(
//     data
//       .map(m => ({ peer: m.peer, url: m.url }))
//       .filter(peer => !HARDCODED_MONITORS.includes(peer.url))
//       .map(peer => peer.peer),
//     peer => peer.match(/\[::ffff:(\d+\.\d+\.\d+\.\d+)\]:\d+/)[1]
//   );
// }

async function checkKnownMonitors() {
  console.log("Checking known nanoNodeMonitors");

  const data = await getDataFromPeers(KNOWN_MONITORS);
  redisClient.set(
    `nano-control-panel/${config.redisNamespace ||
      "default"}/nanoNodeMonitorPeerData`,
    JSON.stringify(data)
  );

  setTimeout(checkKnownMonitors, 10000);
}

export default async function startNetworkDataUpdates() {
  await updateKnownMonitors();

  // Update known monitors every 5 minutes.
  // setInterval(updateKnownMonitors, 300000);

  // checkKnownMonitors();
}
