import _ from "lodash";
import redisFetch from "../../helpers/redisFetch";
import tpsCalculator from "../../helpers/tpsCalculator";
import circulatingSupply from "../../helpers/circulatingSupply";

export default function(app, nano) {
  // nanoNodeMonitor network data
  app.get("/network_data", async (req, res) => {
    try {
      const data = await redisFetch("nanoNodeMonitorPeerData", 10, async () => {
        return [];
      });

      res.json({ network: data });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  app.get("/tps/:period", async (req, res) => {
    try {
      const calc = await tpsCalculator(req.params.period);
      res.json({ tps: calc || 0.0 });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  app.get("/confirmation_quorum", async (req, res) => {
    try {
      const data = await redisFetch("confirmation_quorum", 10, async () => {
        return await nano.rpc("confirmation_quorum");
      });

      data.quorum_delta_mnano = nano.convert.fromRaw(data.quorum_delta, "mrai");
      data.online_weight_minimum_mnano = nano.convert.fromRaw(
        data.online_weight_minimum,
        "mrai"
      );
      data.online_stake_total_mnano = nano.convert.fromRaw(
        data.online_stake_total,
        "mrai"
      );
      data.peers_stake_total_mnano = nano.convert.fromRaw(
        data.peers_stake_total,
        "mrai"
      );

      res.json(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  app.get("/circulating_supply", async (req, res) => {
    try {
      const data = await redisFetch("circulating_supply", 300, async () => {
        return await circulatingSupply();
      });

      res.json(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });
}
