import _ from "lodash";
import { Nano } from "nanode";
import serverConfig from "../../../server-config.json";
import clientConfig from "../../client-config.json";
import Currency from "../../lib/Currency";

const nano = new Nano({ url: serverConfig.nodeHost });

const UNCIRCULATING_ACCOUNTS = [
  "ban_1fundm3d7zritekc8bdt4oto5ut8begz6jnnt7n3tdxzjq3t46aiuse1h7gj",
  "ban_3fundbxxzrzfy3k9jbnnq8d44uhu5sug9rkh135bzqncyy9dw91dcrjg67wf"
];

export default async function circulatingSupply() {
  const uncirculating = _.values(
    (await nano.accounts.balances(UNCIRCULATING_ACCOUNTS)).balances
  )
    .map(a => parseFloat(Currency.fromRaw(a.balance), 10))
    .reduce((acc, val) => acc + val);

  const circulating = clientConfig.currency.maxSupply - uncirculating;

  return {
    circulating,
    uncirculating
  };
}
