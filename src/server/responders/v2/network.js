import Currency from "../../../lib/Currency";
import clientConfig from "../../../client-config.json";

const MAX_SUPPLY_RAW = "340282366920938463463374607431768211455";

export default function(app, nano) {
  app.get("/network/supply", async (req, res) => {
    try {
      const balances = (await nano.accounts.balances([
        clientConfig.currency.genesisAccount,
        clientConfig.currency.emissionAccount
      ])).balances;

      const genesisBalance =
        balances[clientConfig.currency.genesisAccount].balance;
      const emissionBalance =
        balances[clientConfig.currency.emissionAccount].balance;

      const availableSupply = Currency.subtractRaw(
        MAX_SUPPLY_RAW,
        genesisBalance
      );

      const circulatingSupply = Currency.subtractRaw(
        availableSupply,
        emissionBalance
      );

      res.json({
        available: availableSupply,
        circulating: circulatingSupply
      });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });
}
