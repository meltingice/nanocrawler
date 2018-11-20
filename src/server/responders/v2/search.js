import accountSearch from "../../helpers/accountSearch";
import { BadRequest } from "../../errors";

export default function(app, nano) {
  app.get("/search", async (req, res, next) => {
    if (!req.query.q) {
      return res.json({ accounts: [] });
    }

    // Minimum query length of 2
    if (req.query.q.trim().length < 2) {
      return res.json({ accounts: [] });
    }

    if (req.query.q.trim().length > 64) {
      return next(new BadRequest("Search too long"));
    }

    try {
      const accounts = await accountSearch(req.query.q);
      res.json({ accounts });
    } catch (e) {
      next(e);
    }
  });
}
