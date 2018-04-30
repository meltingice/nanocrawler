import _ from "lodash";
import redisFetch from "../helpers/redisFetch";
import officialRepresentatives from "../helpers/officialRepresentatives";

export default function(app, nano) {
  app.get("/representatives_online", async (req, res) => {
    try {
      const representatives = await redisFetch(
        "representatives_online",
        60,
        async () => {
          const reps = (await nano.rpc("representatives")).representatives;
          const repsOnline = (await nano.rpc("representatives_online"))
            .representatives;

          return _.fromPairs(
            _.map(repsOnline, (s, account) => [
              account,
              reps[account] ? nano.convert.fromRaw(reps[account], "mrai") : 0
            ])
          );
        }
      );

      res.json({ representatives });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  app.get("/official_representatives", async (req, res) => {
    try {
      const representatives = await redisFetch(
        "official_representatives",
        60,
        async () => {
          const reps = (await nano.rpc("representatives")).representatives;
          return _.fromPairs(
            officialRepresentatives.map(addr => [
              addr,
              nano.convert.fromRaw(reps[addr], "mrai")
            ])
          );
        }
      );

      res.json({ representatives });
    } catch (e) {
      res.status(500).send({ error: e.message.message });
    }
  });
}
