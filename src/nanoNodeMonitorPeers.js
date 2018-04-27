import _ from "lodash";
import fetch from "node-fetch";
import redis from "redis";
import { Nano } from "nanode";
import config from "../server-config.json";

import NodeMonitor from "./server/NodeMonitor";

const redisClient = redis.createClient(config.redis);
const nano = new Nano({ url: config.nodeHost });

let KNOWN_MONITORS = [];

async function updateKnownMonitors() {
  let monitors = _.keys((await nano.rpc("peers")).peers).map(peer =>
    NodeMonitor.fromPeerAddress(peer)
  );

  monitors = _.uniqBy(
    monitors.concat(config.knownMonitors.map(url => new NodeMonitor(url))),
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

  setTimeout(checkKnownMonitors, 30 * 1000);
}

export default async function startNetworkDataUpdates() {
  await updateKnownMonitors();
  checkKnownMonitors();
}
