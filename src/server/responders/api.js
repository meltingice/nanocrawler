import os from "os";
import _ from "lodash";
import config from "../../../server-config.json";
import redisFetch from "../helpers/redisFetch";
import raiNodeInfo from "../helpers/raiNodeInfo";

export default function(app, nano) {
  // nanoNodeMonitor support
  app.get("/api.php", async (req, res) => {
    try {
      const data = await redisFetch("api.php", 10, async () => {
        const blockCount = await nano.blocks.count();
        const peerCount = _.keys((await nano.rpc("peers")).peers).length;
        const stats = await raiNodeInfo();
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
          usedMem: Math.round(stats.memory / 1024 / 1024),
          totalMem: Math.round(os.totalmem() / 1024 / 1024)
        };
      });

      res.json(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });
}
