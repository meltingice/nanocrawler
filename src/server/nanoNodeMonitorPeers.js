import _ from "lodash";
import fetch from "node-fetch";
import redis from "redis";
import { Nano } from "nanode";
import config from "../../server-config.json";

import NodeMonitor from "./NodeMonitor";

const redisClient = redis.createClient(config.redis);
redisClient.on("error", err => {
  console.error("Redis unavailable");
});

const nano = new Nano({ url: config.nodeHost });

let KNOWN_MONITORS = [];

async function updateKnownMonitors() {
  let monitors = _.keys((await nano.rpc("peers")).peers)
    .filter(
      peer =>
        !config.blacklistedPeers.includes(
          peer.match(/\[(?:\:\:ffff\:)?(.+)\]:\d+/)[1]
        )
    )
    .map(peer => NodeMonitor.fromPeerAddress(peer));

  monitors = monitors.concat(await fetchNanoNodeNinjaMonitors());
  monitors = monitors.concat(
    config.knownMonitors.map(url => new NodeMonitor(url))
  );

  monitors = _.uniqBy(monitors, "apiUrl");

  KNOWN_MONITORS = _.uniqBy(
    _.compact(
      await Promise.all(
        monitors.map(monitor =>
          monitor.fetch().catch(e => console.error(e.message))
        )
      )
    ),
    "data.nanoNodeAccount"
  ).map(data => data.url);

  console.log(`There are now ${KNOWN_MONITORS.length} known monitors`);

  setTimeout(updateKnownMonitors, 5 * 60 * 1000);
}

async function fetchNanoNodeNinjaMonitors() {
  let accounts = [];

  try {
    console.log("Gathering monitors from mynano.ninja");
    const resp = await fetch("https://mynano.ninja/api/accounts/monitors");
    accounts = await resp.json();
  } catch (e) {
    return [];
  }

  return _.compact(
    accounts.map(accountData => {
      if (accountData.monitor && accountData.monitor.url) {
        // Some servies, like Brainblocks, gave their monitor URL as a direct link to
        // the API response. This attempts to fix those instances.
        let apiUrl = /\.php$/.test(accountData.monitor.url)
          ? accountData.monitor.url
          : `${accountData.monitor.url.replace(/(\/$)/, "")}/api.php`;

        console.log("mynano.ninja - OK", apiUrl);
        return new NodeMonitor(apiUrl, "mynano.ninja");
      }
    })
  );
}

async function checkKnownMonitors() {
  console.log("Checking known nanoNodeMonitors");

  const data = _.compact(
    await Promise.all(
      KNOWN_MONITORS.map(url =>
        new NodeMonitor(url, "known")
          .fetch()
          .catch(e => console.error(e.message))
      )
    )
  );

  redisClient.set(
    `nano-control-panel/${config.redisNamespace ||
      "default"}/nanoNodeMonitorPeerData`,
    JSON.stringify(data)
  );

  setTimeout(checkKnownMonitors, 60 * 1000);
}

export default function startNetworkDataUpdates() {
  redisClient.on("ready", async () => {
    await updateKnownMonitors();
    checkKnownMonitors();
  });
}
