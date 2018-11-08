import fetch from "node-fetch";
import moment from "moment";
import _ from "lodash";
import redisFetch from "../../helpers/redisFetch";
import circulatingSupply from "../../helpers/circulatingSupply";
import config from "../../../../server-config.json";

const TOTAL_SUPPLY = 3402823669.2;
const AVERAGED_TRADES = 10;

export default function(app, nano) {
  app.get("/ticker", async (req, res) => {
    try {
      const fiatRates = req.query.cur
        ? req.query.cur.split(",").map(cur => cur.toUpperCase())
        : [];
      const cacheKey = `ticker/${fiatRates.sort().join(":")}`;
      const data = await redisFetch(cacheKey, 60, async () => {
        return await fetchTickerData(fiatRates);
      });

      res.json({ data });
    } catch (e) {
      res.status(500).send({ error: e.message, stack: e.stack });
    }
  });
}

async function fetchTickerData(currencies) {
  const { circulating } = await circulatingSupply();

  const fiatRates = await fetchFiatRates();
  const btcPrice = await fetchBTCPrice();
  const bananoData = await fetchBananoData(circulating);
  calculateUSDPrice(bananoData, btcPrice, circulating);

  const fiatStats = getFiatStats(
    bananoData.USD,
    fiatRates,
    currencies,
    circulating
  );

  return {
    name: "Banano",
    symbol: "BAN",
    circulating_supply: circulating.toString(),
    total_supply: TOTAL_SUPPLY.toString(),
    max_supply: TOTAL_SUPPLY.toString(),
    quotes: _.merge(bananoData, fiatStats),
    last_updated: new Date().getTime() / 1000
  };
}

async function fetchBTCPrice() {
  return await redisFetch(`ticker/BTC`, 500, async () => {
    const resp = await fetch(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=1",
      {
        headers: {
          "X-CMC_PRO_API_KEY": config.coinMarketCapApiKey
        }
      }
    );

    return (await resp.json()).data["1"].quote.USD.price;
  });
}

async function fetchFiatRates() {
  // Update every 2 hours right now, to avoid going over free limits
  return await redisFetch("fiat_exchange_rates", 7200, async () => {
    const resp = await fetch(
      `http://openexchangerates.org/api/latest.json?app_id=${
        config.openExchangeRatesAppId
      }`
    );
    if (resp.ok) {
      return (await resp.json()).rates;
    }

    return {};
  });
}

async function fetchBananoData(circulatingSupply) {
  const resp = await fetch("https://mercatox.com/public/json24");
  const data = (await resp.json()).pairs;

  const mercaToCMC = d => ({
    price: d.last,
    volume_24h: d.quoteVolume,
    market_cap: (circulatingSupply * parseFloat(d.last, 10)).toString()
  });

  return {
    NANO: mercaToCMC(data.BAN_XRB),
    BTC: mercaToCMC(data.BAN_BTC)
  };
}

function calculateUSDPrice(bananoData, btcPrice, circulatingSupply) {
  const usdPrice = bananoData.BTC.price * btcPrice;
  bananoData.USD = {
    price: usdPrice.toString(),
    volume_24h: (btcPrice * bananoData.BTC.volume_24h).toString(),
    market_cap: (circulatingSupply * usdPrice).toString()
  };
}

function getFiatStats(usdStats, exchangeRates, fiatRates, circulatingSupply) {
  if (fiatRates.length === 0) fiatRates = _.keys(exchangeRates);
  return _.fromPairs(
    _.compact(
      fiatRates.map(cur => {
        if (cur === "BTC" || cur === "USD") return null;
        if (!exchangeRates[cur]) return null;

        const price = usdStats.price * exchangeRates[cur];
        return [
          cur,
          {
            price: price.toString(),
            volume_24h: (usdStats.volume_24h * price).toString(),
            market_cap: (circulatingSupply * price).toString()
          }
        ];
      })
    )
  );
}
