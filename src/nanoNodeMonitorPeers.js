import _ from "lodash";
import fetch from "node-fetch";
import redis from "redis";
import { Nano } from "nanode";
import config from "../server-config.json";

const redisClient = redis.createClient(config.redis);
const nano = new Nano({ url: config.nodeHost });

const HARDCODED_MONITORS = [
  "https://nano-api.meltingice.net/api.php",
  "https://nano.nifni.net/api.php",
  "http://node.numberwitch.net/api.php",
  "http://nanode.blizznerds.com/nano/api.php",
  "http://78.233.80.228:8000/api.php"
];
let KNOWN_MONITORS = [];

function fetchWithTimeout(url, duration) {
  let didTimeOut = false;

  return new Promise(function(resolve, reject) {
    const timeout = setTimeout(function() {
      didTimeOut = true;
      reject(new Error(`Request timed out: ${url}`));
    }, duration);

    fetch(url)
      .then(function(response) {
        // Clear the timeout as cleanup
        clearTimeout(timeout);
        if (!didTimeOut) {
          // console.log("fetch good! ", url);
          resolve(response);
        }
      })
      .catch(function(err) {
        // console.log("fetch failed! ", url);

        // Rejection already happened with setTimeout
        if (didTimeOut) return;
        // Reject with error
        reject(err);
      });
  });
}

async function updateKnownMonitors() {
  console.log("Updating our list of known nanoNodeMonitors");

  const peers = _.keys((await nano.rpc("peers")).peers);
  const data = await getDataFromPeers(peers);

  KNOWN_MONITORS = _.uniqBy(
    data.map(m => m.peer).filter(peer => !HARDCODED_MONITORS.includes(peer)),
    peer => peer.match(/\[::ffff:(\d+\.\d+\.\d+\.\d+)\]:\d+/)[1]
  );
}

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

async function getDataFromPeers(peers) {
  return _.compact(
    await Promise.all(
      HARDCODED_MONITORS.map(apiUrl => {
        return new Promise((resolve, reject) => {
          checkForMonitor(apiUrl, apiUrl)
            .then(data => resolve(data))
            .catch(resolve);
        });
      }).concat(
        peers.map(peer => {
          return new Promise((resolve, reject) => {
            const peerIp = peer.match(/\[::ffff:(\d+\.\d+\.\d+\.\d+)\]:\d+/)[1];
            const apiUrl = `http://${peerIp}/api.php`;

            checkForMonitor(peer, apiUrl)
              .then(data => resolve(data))
              .catch(resolve);
          });
        })
      )
    )
  );
}

function checkForMonitor(peer, url) {
  return new Promise((resolve, reject) => {
    fetchWithTimeout(url, 5000)
      .then(resp => {
        if (resp.ok) {
          console.log("OK", url);
          return resp
            .json()
            .then(data => {
              if (data.nanoNodeAccount) {
                resolve({ peer, url, data: formatData(data) });
              } else {
                reject();
              }
            })
            .catch(e => {
              console.log("FAIL", "JSON not parseable", url);
              reject();
            });
        }

        console.log("FAIL", `Received ${resp.status}`);
        reject();
      })
      .catch(e => {
        console.log("FAIL", e.message);
        reject();
      });
  });
}

function formatData(data) {
  data.currentBlock = parseInt(
    data.currentBlock.toString().replace(/[^\d\.]/g, ""),
    10
  );
  data.uncheckedBlocks = parseInt(
    data.uncheckedBlocks.toString().replace(/[^\d\.]/g, ""),
    10
  );
  data.numPeers = parseInt(
    data.numPeers.toString().replace(/[^\d\.]/g, ""),
    10
  );

  if (data.votingWeight) {
    data.votingWeight = parseFloat(
      data.votingWeight.toString().replace(/[^\d\.]/g, ""),
      10
    );
  }

  return data;
}

export default async function startNetworkDataUpdates() {
  await updateKnownMonitors();

  // Update known monitors every 5 minutes.
  setInterval(updateKnownMonitors, 300000);

  checkKnownMonitors();
}
