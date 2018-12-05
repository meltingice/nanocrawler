import fetch from "node-fetch";
import config from "../../../../server-config.json";
import redisFetch from "../../helpers/redisFetch";

export default function(app, nano) {
  app.get("/ticker", async (req, res, next) => {
    if (!config.coinMarketCapApiKey) {
      return next(
        new Error("The server is not configured with a CoinMarketCap API key")
      );
    }

    try {
      const data = await redisFetch("ticker/NANO", 900, async () => {
        return {
          USD: await fetchQuote("USD"),
          BTC: await fetchQuote("BTC")
        };
      });

      res.json(data);
    } catch (e) {
      next(e);
    }
  });
}

const fetchQuote = async cur => {
  const resp = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=NANO&convert=${cur}`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": config.coinMarketCapApiKey
      }
    }
  );

  if (resp.ok) {
    const data = await resp.json();
    return data.data.NANO.quote[cur].price;
  } else {
    throw new Error(`CoinMarketCap error: ${resp.status} ${resp.statusText}`);
  }
};
