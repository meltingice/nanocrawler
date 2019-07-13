import redisFetch from "../../helpers/redisFetch";

export default function(app, nano) {
  /*
   * active_difficulty
   * Returns the current network PoW difficulty level
   * Includes difficulty trend
   */
  app.get("/network/active_difficulty", async (req, res, next) => {
    try {
      const data = await redisFetch(
        "v2/network/active_difficulty",
        10,
        async () => {
          return await nano.rpc("active_difficulty", { include_trend: true });
        }
      );

      res.json(data);
    } catch (e) {
      next(e);
    }
  });
}
