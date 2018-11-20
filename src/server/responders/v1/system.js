import os from "os";
import raiNodeInfo from "../../helpers/raiNodeInfo";
import dbSize from "../../helpers/dbSize";
import redisFetch from "../../helpers/redisFetch";

export default function(app, nano) {
  app.get("/version", async (req, res, next) => {
    try {
      const version = await redisFetch("version", 3600, async () => {
        return await nano.rpc("version");
      });

      res.json(version);
    } catch (e) {
      next(e);
    }
  });

  app.get("/system_info", async (req, res, next) => {
    try {
      const data = await redisFetch("systemInfo", 10, async () => {
        const stats = await raiNodeInfo();
        return {
          uptime: os.uptime(),
          loadAvg: os.loadavg(),
          memory: {
            free: os.freemem(),
            total: os.totalmem()
          },
          dbSize: await dbSize(),
          raiStats: {
            cpu: stats.cpu,
            memory: stats.memory,
            elapsed: stats.elapsed
          }
        };
      });

      res.json(data);
    } catch (e) {
      next(e);
    }
  });
}
