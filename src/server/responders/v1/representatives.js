import _ from "lodash";
import redisFetch from "../../helpers/redisFetch";
import config from "../../../../server-config.json";
import Currency from "../../../lib/Currency";

export default function(app, nano) {
  app.get("/representatives_online", async (req, res) => {
    try {
      const representatives = await redisFetch(
        "representatives_online",
        300,
        async () => {
          const reps = (await nano.rpc("representatives")).representatives;
          const repsOnline = (await nano.rpc("representatives_online"))
            .representatives;

          return _.fromPairs(
            _.map(repsOnline, (s, account) => [
              account,
              reps[account] ? Currency.fromRaw(reps[account]) : 0
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
            config.officialRepresentatives.map(addr => [
              addr,
              Currency.fromRaw(reps[addr])
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
