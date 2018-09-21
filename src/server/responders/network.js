import _ from "lodash";
import redisFetch from "../helpers/redisFetch";
import tpsCalculator from "../helpers/tpsCalculator";
import { wealthDistribution } from "../helpers/frontiers";

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

  app.get("/rich_list", async (req, res) => {
    try {
      const distribution = {
        1: await wealthDistribution(0, 1),
        10: await wealthDistribution(1, 10),
        100: await wealthDistribution(10, 100),
        1000: await wealthDistribution(100, 1000),
        10000: await wealthDistribution(1000, 10000),
        100000: await wealthDistribution(10000, 100000),
        1000000: await wealthDistribution(100000, 1000000),
        10000000: await wealthDistribution(10000000, 100000000)
      };

      res.json({
        distribution
      });
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
}
