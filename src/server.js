import os from "os";

import _ from "lodash";
import { Nano } from "nanode";
import express from "express";
import cors from "cors";

import redisFetch from "./server/redisFetch";
import dbSize from "./server/dbSize";
import config from "../server-config.json";

const nano = new Nano({ url: config.nodeHost });

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.redirect(config.clientUrl);
});

app.get("/account", async (req, res) => {
  res.json({ account: config.account });
});

app.get("/weight", async (req, res) => {
  const weight = await redisFetch("weight", 300, async () => {
    return nano.convert.fromRaw(
      await nano.accounts.weight(config.account),
      "mrai"
    );
  });

  res.json({ weight });
});

app.get("/block_count", async (req, res) => {
  const blockCount = await redisFetch("blockCount", 10, async () => {
    return await nano.blocks.count();
  });

  res.json({ blockCount });
});

app.get("/block_count_by_type", async (req, res) => {
  const blockCount = await redisFetch("blockCountByType", 10, async () => {
    return await nano.blocks.count(true);
  });

  res.json(blockCount);
});

app.get("/peer_count", async (req, res) => {
  const peerCount = await redisFetch("peerCount", 60, async () => {
    return _.keys((await nano.rpc("peers")).peers).length;
  });

  res.json({ peerCount: peerCount });
});

app.get("/peers", async (req, res) => {
  const peers = await redisFetch("peers", 60, async () => {
    return await nano.rpc("peers");
  });

  res.json(peers);
});

app.get("/version", async (req, res) => {
  const version = await redisFetch("version", 3600, async () => {
    return await nano.rpc("version");
  });

  res.json(version);
});

app.get("/delegators_count", async (req, res) => {
  const delegatorsCount = await redisFetch("delegatorsCount", 300, async () => {
    return await nano.rpc("delegators_count", { account: config.account });
  });

  res.json(delegatorsCount);
});

app.get("/balance", async (req, res) => {
  const balances = await redisFetch("balance", 300, async () => {
    const resp = await nano.rpc("account_balance", { account: config.account });
    return {
      balance: nano.convert.fromRaw(resp.balance, "mrai"),
      pending: nano.convert.fromRaw(resp.pending, "mrai")
    };
  });

  res.json(balances);
});

app.get("/history", async (req, res) => {
  const history = await redisFetch("history", 60, async () => {
    const resp = await nano.accounts.history(config.account);
    return resp.map(block => {
      if (block.amount) {
        block.amount = nano.convert.fromRaw(block.amount, "mrai");
      }

      return block;
    });
  });

  res.json(history);
});

app.get("/delegators", async (req, res) => {
  const delegators = await redisFetch("delegators", 300, async () => {
    const resp = await nano.rpc("delegators", { account: config.account });
    return _.fromPairs(
      _.map(resp.delegators, (balance, account) => {
        return [account, nano.convert.fromRaw(balance, "mrai")];
      })
    );
  });

  res.json(delegators);
});

app.get("/representatives_online", async (req, res) => {
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
});

app.get("/system_info", async (req, res) => {
  const data = await redisFetch("systemInfo", 10, async () => {
    return {
      uptime: os.uptime(),
      loadAvg: os.loadavg(),
      memory: {
        free: os.freemem(),
        total: os.totalmem()
      },
      dbSize: await dbSize()
    };
  });

  res.json(data);
});

// nanonode.ninja support
app.get("/api.php", async (req, res) => {
  const data = await redisFetch("api.php", 10, async () => {
    const blockCount = await nano.blocks.count();
    const peerCount = _.keys((await nano.rpc("peers")).peers).length;
    const usedMem = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);

    return {
      nanoNodeName: config.nodeName,
      nanoNodeAccount: config.account,
      version: (await nano.rpc("version")).node_vendor,
      currentBlock: blockCount.count,
      uncheckedBlocks: blockCount.unchecked,
      numPeers: peerCount,
      usedMem: usedMem,
      totalMem: Math.round(os.totalmem() / 1024 / 1024)
    };
  });

  res.json(data);
});

app.listen(config.serverPort || 3001);
