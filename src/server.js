import os from "os";

import _ from "lodash";
import { Nano } from "nanode";
import express from "express";
import cors from "cors";

import redisFetch from "./server/redisFetch";
import dbSize from "./server/dbSize";
import officialRepresentatives from "./server/officialRepresentatives";
import raiNodeInfo from "./server/raiNodeInfo";
import { accountIsValid, processBlock } from "./server/util";
import config from "../server-config.json";

import startNetworkDataUpdates from "./nanoNodeMonitorPeers";
startNetworkDataUpdates();

const nano = new Nano({ url: config.nodeHost });

const app = express();
app.use(cors());

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({ error: err });
});

app.get("/", (req, res) => {
  res.redirect(config.clientUrl);
});

app.get("/account", async (req, res) => {
  res.json({ account: config.account });
});

app.get("/account/:account", async (req, res) => {
  if (!accountIsValid(req.params.account)) {
    res.status(400).send({ error: "Invalid account" });
  }

  try {
    const account = await redisFetch(
      `account/${req.params.account}`,
      60,
      async () => {
        const account = await nano.rpc("account_info", {
          account: req.params.account,
          representative: true,
          weight: true,
          pending: true
        });

        account.balance = nano.convert.fromRaw(account.balance, "mrai");
        account.pending = nano.convert.fromRaw(account.pending, "mrai");
        account.weight = nano.convert.fromRaw(account.weight, "mrai");

        return account;
      }
    );

    res.json({ account });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.get("/weight/:account", async (req, res) => {
  if (!accountIsValid(req.params.account)) {
    res.status(400).send({ error: "Invalid account" });
  }

  try {
    const weight = await redisFetch(
      `weight/${req.params.account}`,
      600,
      async () => {
        return nano.convert.fromRaw(
          await nano.accounts.weight(req.params.account),
          "mrai"
        );
      }
    );

    res.json({ weight });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.get("/block_count", async (req, res) => {
  try {
    const blockCount = await redisFetch("blockCount", 10, async () => {
      return await nano.blocks.count();
    });

    res.json({ blockCount });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.get("/block_count_by_type", async (req, res) => {
  try {
    const blockCount = await redisFetch("blockCountByType", 10, async () => {
      return await nano.blocks.count(true);
    });

    res.json(blockCount);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.get("/peer_count", async (req, res) => {
  try {
    const peerCount = await redisFetch("peerCount", 60, async () => {
      return _.keys((await nano.rpc("peers")).peers).length;
    });

    res.json({ peerCount: peerCount });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.get("/peers", async (req, res) => {
  try {
    const peers = await redisFetch("peers", 60, async () => {
      return await nano.rpc("peers");
    });

    res.json(peers);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.get("/version", async (req, res) => {
  try {
    const version = await redisFetch("version", 3600, async () => {
      return await nano.rpc("version");
    });

    res.json(version);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.get("/delegators/:account", async (req, res) => {
  if (!accountIsValid(req.params.account)) {
    res.status(400).send({ error: "Invalid account" });
  }

  try {
    const delegators = await redisFetch(
      `delegators/${req.params.account}`,
      3600,
      async () => {
        const resp = await nano.rpc("delegators", {
          account: req.params.account
        });
        return _.fromPairs(
          _.map(resp.delegators, (balance, account) => {
            return [account, nano.convert.fromRaw(balance, "mrai")];
          })
        );
      }
    );

    res.json(delegators);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.get("/history/:account", async (req, res) => {
  if (!accountIsValid(req.params.account)) {
    res.status(400).send({ error: "Invalid account" });
  }

  try {
    const history = await redisFetch(
      `history/${req.params.account}`,
      60,
      async () => {
        // const resp = await nano.accounts.history(req.params.account, 20);
        const resp = (await nano.rpc("account_history", {
          account: req.params.account,
          count: 20,
          raw: "true"
        })).history;
        return resp.map(block => {
          if (block.amount) {
            block.amount = nano.convert.fromRaw(block.amount, "mrai");
          }

          return block;
        });
      }
    );

    res.json(history);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.get("/block/:hash", async (req, res) => {
  try {
    const block = await redisFetch(
      `block/${req.params.hash}`,
      2592000,
      async () => {
        const blocks = (await nano.rpc("blocks_info", {
          hashes: [req.params.hash],
          pending: true,
          source: true
        })).blocks;

        return processBlock(blocks[_.keys(blocks)[0]]);
      }
    );

    res.json(block);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.get("/representatives_online", async (req, res) => {
  try {
    const representatives = await redisFetch(
      "representatives_online",
      60,
      async () => {
        const reps = (await nano.rpc("representatives")).representatives;
        const repsOnline = (await nano.rpc("representatives_online"))
          .representatives;

        return _.fromPairs(
          _.map(repsOnline, (s, account) => [
            account,
            reps[account] ? nano.convert.fromRaw(reps[account], "mrai") : 0
          ])
        );
      }
    );

    res.json({ representatives });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.get("/official_representatives", async (req, res) => {
  try {
    const representatives = await redisFetch(
      "official_representatives",
      60,
      async () => {
        const reps = (await nano.rpc("representatives")).representatives;
        return _.fromPairs(
          officialRepresentatives.map(addr => [
            addr,
            nano.convert.fromRaw(reps[addr], "mrai")
          ])
        );
      }
    );

    res.json({ representatives });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.get("/system_info", async (req, res) => {
  try {
    const data = await redisFetch("systemInfo", 10, async () => {
      const stats = await raiNodeInfo();
      return {
        uptime: os.uptime(),
        loadAvg: os.loadavg(),
        memory: {
          free: os.freemem(),
          total: os.totalmem()
        },
        dbSize: await dbSize(),
        raiStats: {
          cpu: stats.cpu,
          memory: stats.memory,
          elapsed: stats.elapsed
        }
      };
    });

    res.json(data);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

// nanoNodeMonitor support
app.get("/api.php", async (req, res) => {
  try {
    const data = await redisFetch("api.php", 10, async () => {
      const blockCount = await nano.blocks.count();
      const peerCount = _.keys((await nano.rpc("peers")).peers).length;
      const usedMem = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
      const weight = parseFloat(
        nano.convert.fromRaw(
          await nano.accounts.weight(config.account),
          "mrai"
        ),
        10
      );

      return {
        nanoNodeName: config.nodeName,
        nanoNodeAccount: config.account,
        version: (await nano.rpc("version")).node_vendor,
        currentBlock: blockCount.count,
        uncheckedBlocks: blockCount.unchecked,
        votingWeight: weight,
        numPeers: peerCount,
        usedMem: usedMem,
        totalMem: Math.round(os.totalmem() / 1024 / 1024)
      };
    });

    res.json(data);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

// nanoNodeMonitor network data
app.get("/network_data", async (req, res) => {
  try {
    const data = await redisFetch("nanoNodeMonitorPeerData", 10, async () => {
      return [];
    });

    res.json({ network: data });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.listen(config.serverPort || 3001);
