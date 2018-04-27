import _ from "lodash";
import fetch from "node-fetch";
import redis from "redis";
import { Nano } from "nanode";
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

  KNOWN_MONITORS = _.compact(
    await Promise.all(
      monitors.map(monitor =>
        monitor.fetch().catch(e => console.error(e.message))
      )
    )
  ).map(data => data.url);

  console.log(`There are now ${KNOWN_MONITORS.length} known monitors`);

  setTimeout(updateKnownMonitors, 5 * 60 * 1000);
}

async function checkKnownMonitors() {
  console.log("Checking known nanoNodeMonitors");

  const data = _.compact(
    await Promise.all(
      KNOWN_MONITORS.map(url =>
        new NodeMonitor(url).fetch().catch(e => console.error(e.message))
      )
    )
  );

  redisClient.set(
    `nano-control-panel/${config.redisNamespace ||
      "default"}/nanoNodeMonitorPeerData`,
    JSON.stringify(data)
  );

  setTimeout(checkKnownMonitors, 10000);
}

export default async function startNetworkDataUpdates() {
  await updateKnownMonitors();
  checkKnownMonitors();
}
