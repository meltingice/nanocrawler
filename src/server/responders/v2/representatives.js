import _ from "lodash";
import redisFetch from "../../helpers/redisFetch";
import officialRepresentatives from "../../helpers/officialRepresentatives";

export default function(app, nano) {
  /*
   * representatives_online
   * Returns hash of online representatives, including their voting weight
   */
  app.get("/representatives/online", async (req, res) => {
    try {
      const representatives = await redisFetch(
        "v2/representatives_online",
        300,
        async () => {
          const reps = (await nano.rpc("representatives")).representatives;
          const repsOnline = (await nano.rpc("representatives_online"))
            .representatives;

          return _.fromPairs(
            _.map(repsOnline, (s, account) => [
              account,
              reps[account] ? reps[account] : "0"
            ])
          );
        }
      );

      res.json({ representatives });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  /*
   * representatives
   * Returns list of official representatives only, with their voting weight
   */
  app.get("/representatives/official", async (req, res) => {
    try {
      const representatives = await redisFetch(
        "v2/official_representatives",
        60,
        async () => {
          const reps = (await nano.rpc("representatives")).representatives;
          return _.fromPairs(
            officialRepresentatives.map(addr => [addr, reps[addr]])
          );
        }
      );

      res.json({ representatives });
    } catch (e) {
      res.status(500).send({ error: e.message.message });
    }
  });
}
