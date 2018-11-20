import _ from "lodash";
import redisFetch from "../../helpers/redisFetch";
import {
  blockIsValid,
  processBlock,
  getTimestampForHash
} from "../../helpers/util";
import { BadRequest, NotFound } from "../../errors";

export default function(app, nano) {
  /*
   * blocks_info
   * Retrieves information about a single block
   */
  app.get("/blocks/:hash", async (req, res, next) => {
    if (!blockIsValid(req.params.hash)) {
      return next(new BadRequest("Block hash is invalid"));
    }

    try {
      const block = await redisFetch(
        `v2/block/${req.params.hash}`,
        604800,
        async () => {
          const resp = await nano.rpc("blocks_info", {
            hashes: [req.params.hash],
            pending: true,
            source: true
          });

          if (resp.error) {
            switch (resp.error) {
              case "Block not found":
                throw new NotFound(resp.error);
              default:
                throw new BadRequest(resp.error);
            }
          }

          let block = resp.blocks[req.params.hash];
          block.timestamp = await getTimestampForHash(req.params.hash);
          return await processBlock(req.params.hash, block);
        }
      );

      res.json(block);
    } catch (e) {
      next(e);
    }
  });
}
