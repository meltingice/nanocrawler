import _ from "lodash";
import { Nano } from "nanode";
import config from "../../../server-config.json";

const nano = new Nano({ url: config.nodeHost });

const TOTAL_SUPPLY = 3402823669.2;
const UNCIRCULATING_ACCOUNTS = [
  "ban_1fundm3d7zritekc8bdt4oto5ut8begz6jnnt7n3tdxzjq3t46aiuse1h7gj",
  "ban_3fundbxxzrzfy3k9jbnnq8d44uhu5sug9rkh135bzqncyy9dw91dcrjg67wf"
];

export default async function circulatingSupply() {
  const uncirculating = _.values(
    (await nano.accounts.balances(UNCIRCULATING_ACCOUNTS)).balances
  )
    .map(a => parseFloat(nano.convert.fromRaw(a.balance, "mrai"), 10) * 10)
    .reduce((acc, val) => acc + val);

  const circulating = TOTAL_SUPPLY - uncirculating;

  return {
    circulating,
    uncirculating
  };
}
