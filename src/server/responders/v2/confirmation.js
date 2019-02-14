import redisFetch from "../../helpers/redisFetch";

export default function(app, nano) {
  app.get("/confirmation/active", async (req, res, next) => {
    try {
      const data = await redisFetch("confirmation_active", 5, async () => {
        const hashes = (await nano.rpc("confirmation_active")).confirmations;
        if (hashes === "") return [];

        let hydratedData = [];
        for (let i = 0; i < hashes.length; i++) {
          const info = await nano.rpc("confirmation_info", {
            root: hashes[i],
            contents: false
          });

          if (!info.error) hydratedData.push(info);
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
      const data = await redisFetch(
        "confirmation_history",
        5,
        async () => await nano.rpc("confirmation_history")
      );

      res.json(data);
    } catch (e) {
      next(e);
    }
  });
}
