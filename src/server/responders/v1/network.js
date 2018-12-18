import _ from "lodash";
import redisFetch from "../../helpers/redisFetch";
import tpsCalculator from "../../helpers/tpsCalculator";
import Currency from "../../../lib/Currency";

export default function(app, nano) {
  // nanoNodeMonitor network data
  app.get("/network_data", async (req, res, next) => {
    try {
      const data = await redisFetch("nanoNodeMonitorPeerData", 10, async () => {
        return [];
      });

      res.json({ network: data });
    } catch (e) {
      next(e);
    }
  });

  app.get("/tps/:period", async (req, res, next) => {
    try {
      const calc = await tpsCalculator(req.params.period);
      res.json({ tps: calc || 0.0 });
    } catch (e) {
      next(e);
    }
  });

  app.get("/confirmation_quorum", async (req, res, next) => {
    try {
      const data = await redisFetch("confirmation_quorum", 10, async () => {
        return await nano.rpc("confirmation_quorum");
      });

      data.quorum_delta_mnano = Currency.fromRaw(data.quorum_delta);
      data.online_weight_minimum_mnano = Currency.fromRaw(
        data.online_weight_minimum
      );
      data.online_stake_total_mnano = Currency.fromRaw(data.online_stake_total);
      data.peers_stake_total_mnano = Currency.fromRaw(data.peers_stake_total);

      res.json(data);
    } catch (e) {
      next(e);
    }
  });
}
