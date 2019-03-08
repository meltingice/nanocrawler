import redisFetch from "../../helpers/redisFetch";
import Currency from "../../../lib/Currency";
import config from "../../../client-config.json";

export default function(app, nano) {
  app.get("/network/supply", async (req, res) => {
    res.json({
      available: config.currency.availableSupply,
      circulating: config.currency.circulatingSupply
    });
  });
}
