import _ from "lodash";
import redisFetch from "../../helpers/redisFetch";
import { processBlock, getTimestampForHash } from "../../helpers/util";

export default function(app, nano) {
  /*
   * blocks_info
   * Retrieves information about a single block
   */
  app.get("/blocks/:hash", async (req, res) => {
    try {
      const block = await redisFetch(
        `v2/block/${req.params.hash}`,
        604800,
        async () => {
          const blocks = (await nano.rpc("blocks_info", {
            hashes: [req.params.hash],
            pending: true,
            source: true
          })).blocks;

          let block = blocks[req.params.hash];
          block.timestamp = await getTimestampForHash(req.params.hash);
          return await processBlock(req.params.hash, block);
        }
      );

      res.json(block);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });
}
