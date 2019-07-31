import _ from "lodash";
import redisFetch from "../../helpers/redisFetch";

export default function(app, nano) {
  app.get("/confirmation/active", async (req, res, next) => {
    try {
      const data = await redisFetch("confirmation_active", 2, async () => {
        const hashes = (await nano.rpc("confirmation_active")).confirmations;
        if (hashes === "") return [];

        let hydratedData = [];
        for (let i = 0; i < hashes.length; i++) {
          const info = await nano.rpc("confirmation_info", {
            root: hashes[i]
          });

          if (!info.error) {
            _.forEach(info.blocks, (block, hash) => {
              info.blocks[hash].contents = JSON.parse(block.contents);
            });

            hydratedData.push(info);
          }
        }

        return hydratedData;
      });

      res.json({ blocks: data });
    } catch (e) {
      next(e);
    }
  });

  app.get("/confirmation/info/:hash", async (req, res, next) => {
    try {
      const data = await nano.rpc("confirmation_info", {
        root: req.params.hash,
        contents: false,
        representatives: true
      });

      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  app.get("/confirmation/history", async (req, res, next) => {
    try {
      const data = await redisFetch("confirmation_history", 10, async () => {
        const resp = await nano.rpc("confirmation_history");
        if (!resp.confirmations) resp.confirmations = [];
        resp.confirmations.sort((a, b) => {
          const timeA = parseInt(a.time, 10);
          const timeB = parseInt(b.time, 10);
          if (timeA === timeB) return 0;
          return timeA > timeB ? -1 : 1;
        });
        return resp;
      });

      if (req.query.count && /\d+/.test(req.query.count)) {
        data.confirmations = data.confirmations.slice(
          0,
          parseInt(req.query.count, 10)
        );
      }

      res.json(data);
    } catch (e) {
      next(e);
    }
  });
}
