import redisFetch from "../helpers/redisFetch";

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
}
