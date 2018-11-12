import accountSearch from "../../helpers/accountSearch";

export default function(app, nano) {
  app.get("/search", async (req, res) => {
    if (!req.query.q) {
      return res.json({ accounts: [] });
    }

    // Minimum query length of 2
    if (req.query.q.trim().length < 2) {
      return res.json({ accounts: [] });
    }

    if (req.query.q.trim().length > 64) {
      return res.status(400).send({ error: "Search too long" });
    }

    try {
      const accounts = await accountSearch(req.query.q);
      res.json({ accounts });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });
}
