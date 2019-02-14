import _ from "lodash";
import redisFetch from "../../helpers/redisFetch";
import { processBlock, getTimestampForHash } from "../../helpers/util";

export default function(app, nano) {
  app.get("/block/:hash", async (req, res, next) => {
    try {
      const block = await redisFetch(
        `block/v5/${req.params.hash}`,
        604800,
        async () => {
          const blocks = (await nano.rpc("blocks_info", {
            hashes: [req.params.hash],
            pending: true,
            source: true
          })).blocks;

          let block = blocks[req.params.hash];
          block.timestamp = await getTimestampForHash(req.params.hash);
          return await processBlock(req.params.hash, block, true);
        }
      );

      res.json(block);
    } catch (e) {
      next(e);
    }
  });

  app.get("/block_count", async (req, res, next) => {
    try {
      const blockCount = await redisFetch("blockCount", 10, async () => {
        return await nano.blocks.count();
      });

      res.json({ blockCount });
    } catch (e) {
      next(e);
    }
  });

  app.get("/block_count_by_type", async (req, res, next) => {
    try {
      const blockCount = await redisFetch("blockCountByType", 10, async () => {
        return await nano.blocks.count(true);
      });

      res.json(blockCount);
    } catch (e) {
      next(e);
    }
  });
}
