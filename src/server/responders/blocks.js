import _ from "lodash";
import redisFetch from "../helpers/redisFetch";
import { processBlock, getTimestampForHash } from "../helpers/util";

export default function(app, nano) {
  app.get("/block/:hash", async (req, res) => {
    try {
      const block = await redisFetch(
        `block/v2/${req.params.hash}`,
        2592000,
        async () => {
          const blocks = (await nano.rpc("blocks_info", {
            hashes: [req.params.hash],
            pending: true,
            source: true
          })).blocks;

          let block = blocks[_.keys(blocks)[0]];
          block.timestamp = await getTimestampForHash(req.params.hash);
          return await processBlock(block);
        }
      );

      res.json(block);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  app.get("/block_count", async (req, res) => {
    try {
      const blockCount = await redisFetch("blockCount", 10, async () => {
        return await nano.blocks.count();
      });

      res.json({ blockCount });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  app.get("/block_count_by_type", async (req, res) => {
    try {
      const blockCount = await redisFetch("blockCountByType", 10, async () => {
        return await nano.blocks.count(true);
      });

      res.json(blockCount);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });
}
