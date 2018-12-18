import os from "os";
import _ from "lodash";
import config from "../../../../server-config.json";
import redisFetch from "../../helpers/redisFetch";
import raiNodeInfo from "../../helpers/raiNodeInfo";
import { getNinjaData } from "../../helpers/myNanoNinja";
import networkStats from "../../helpers/networkStats";
import Currency from "../../../lib/Currency";

export default function(app, nano) {
  // nanoNodeMonitor support
  app.get("/api.php", async (req, res, next) => {
    try {
      const data = await redisFetch("api.php", 10, async () => {
        const blockCount = await nano.blocks.count();
        const peerCount = _.keys((await nano.rpc("peers")).peers).length;
        const accBalanceMnano = parseFloat(
          await nano.accounts.nanoBalance(config.account),
          10
        );
        const stats = await raiNodeInfo();
        const weight = parseFloat(
          Currency.fromRaw(await nano.accounts.weight(config.account)),
          10
        );

        const nodeNinja = await getNinjaData(config.account);
        const blockStats = await networkStats();

        const blockSync =
          Math.round(
            (parseInt(blockCount.count, 10) / blockStats.maxBlockCount) *
              10000.0
          ) / 100.0;

        return {
          nanoNodeName: config.nodeName,
          nanoNodeAccount: config.account,
          version: (await nano.rpc("version")).node_vendor,
          currentBlock: blockCount.count,
          uncheckedBlocks: blockCount.unchecked,
          blockSync,
          votingWeight: weight,
          numPeers: peerCount,
          accBalanceMnano,
          usedMem: Math.round(stats.memory / 1024 / 1024),
          totalMem: Math.round(os.totalmem() / 1024 / 1024),
          nodeNinja
        };
      });

      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  app.get("/operations", async (req, res, next) => {
    try {
      const data = await redisFetch("operations", 60, async () => {
        return await nano.blocks.count();
      });

      res.send(data.count);
    } catch (e) {
      next(e);
    }
  });
}
