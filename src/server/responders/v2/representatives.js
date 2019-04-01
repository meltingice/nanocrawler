import _ from "lodash";
import redisFetch from "../../helpers/redisFetch";
import config from "../../../../server-config.json";

export default function(app, nano) {
  /*
   * representatives_online
   * Returns hash of online representatives, including their voting weight
   */
  app.get("/representatives/online", async (req, res, next) => {
    try {
      const representatives = await redisFetch(
        "v3/representatives_online",
        300,
        async () => {
          const repsOnline = (await nano.rpc("representatives_online", {
            weight: true
          })).representatives;

          return _.fromPairs(
            _.map(repsOnline, (data, account) => [account, data.weight])
          );
        }
      );

      res.json({ representatives });
    } catch (e) {
      next(e);
    }
  });

  /*
   * representatives
   * Returns list of official representatives only, with their voting weight
   */
  app.get("/representatives/official", async (req, res, next) => {
    try {
      const representatives = await redisFetch(
        "v2/official_representatives",
        60,
        async () => {
          const reps = (await nano.rpc("representatives")).representatives;
          return _.fromPairs(
            config.officialRepresentatives.map(addr => [addr, reps[addr]])
          );
        }
      );

      res.json({ representatives });
    } catch (e) {
      next(e);
    }
  });
}
