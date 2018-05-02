import redisFetch from "../helpers/redisFetch";

export default function(app, nano) {
  app.get("/statistics/:type", async (req, res) => {
    if (!["counters", "samples"].includes(req.params.type)) {
      res.sendStatus(400);
      return;
    }

    const data = await redisFetch(
      `statistics/${req.params.type}`,
      5,
      async () => {
        return await nano.rpc("stats", { type: req.params.type });
      }
    );

    res.json(data);
  });
}
