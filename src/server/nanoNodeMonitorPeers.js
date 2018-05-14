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
          peer.match(/\[::ffff:(\d+\.\d+\.\d+\.\d+)\]:\d+/)[1]
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
  let monitors = [];

  try {
    console.log("Gathering monitors from nanonode.ninja");
    const resp = await fetch("https://nanonode.ninja/api/accounts/verified");
    accounts = await resp.json();
  } catch (e) {
    return [];
  }

  console.log(`Checking ${accounts.length} accounts for node monitors...`);
  for (let i = 0; i < accounts.length; i++) {
    try {
      const accountResp = await fetch(
        `https://nanonode.ninja/api/accounts/${accounts[i].account}`
      );
      const accountData = await accountResp.json();

      if (accountData.monitor && accountData.monitor.url) {
        console.log("OK", accountData.monitor.url);
        monitors.push(
          new NodeMonitor(
            `${accountData.monitor.url.replace(/(\/$)/, "")}/api.php`
          )
        );
      }
    } catch (e) {}
  }

  return monitors;
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

export default function startNetworkDataUpdates() {
  redisClient.on("ready", async () => {
    await updateKnownMonitors();
    checkKnownMonitors();
  });
}
