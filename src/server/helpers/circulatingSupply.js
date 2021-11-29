import _ from "lodash";
import { Nano } from "nanode";
import serverConfig from "../../../server-config.json";
import clientConfig from "../../client-config.json";
import Currency from "../../lib/Currency";

const nano = new Nano({ url: serverConfig.nodeHost });

const UNCIRCULATING_ACCOUNTS = [
  "ban_1fundm3d7zritekc8bdt4oto5ut8begz6jnnt7n3tdxzjq3t46aiuse1h7gj",
  "ban_3fundbxxzrzfy3k9jbnnq8d44uhu5sug9rkh135bzqncyy9dw91dcrjg67wf",
  "ban_1acaih1rhhczkfayd3iadpjroyfbbrzm1jrkx77qfep7fnuzky7mmwzx4544",
  "ban_3carobzdy3ah8pq1xzn38jkc46ozuu8qfx7eqzr8nyiy5yefwbaua6rkh3of",
  "ban_1grapemjtr5n684bu1x38th57x3te8qt6xpsyusjyi4s3u1zdoh8s1czfjz4",
  "ban_1ycheefobbddbde1p7874ky4ifiwebfuabkyqptunwwk84z3rgzktbqeo9fk",
  "ban_1me1onk3a11nw3kou14776fuyxtnmoatuqmpeioybffqx6okd53mo1iqmrym",
  "ban_3gojim9wh3t9w5aa8nhjbmkue8mes9frmrhy6wpqb34ikajw8h39hnbbap31",
  "ban_1app1es6zce5943ydasp5r5ma77cdcqt6be8qz7f88woayuqstzrjjmob4eb",
  "ban_1mangozo4tnfq97hdtu8z9rdjsqnyo33i7o9aohoxsfbpx8kgwhrfu1rggj8",
  "ban_3kiwizqifxokn47pp6fh5jmytoaiaeynjhx4u5r6ug13apx3345enf4mr1ep",
  "ban_1pearw95xajkzq1nmo6cixo1ugijk6gpm1ifwyegz6un4mt71qb1iw3fhmj4"
];

const BURN_ADDRESSES = [
  "ban_1burnbabyburndiscoinferno111111111111111111111111111aj49sw3w"
];

export default async function circulatingSupply() {
  const uncirculating = _.values(
    (await nano.accounts.balances(UNCIRCULATING_ACCOUNTS)).balances
  )
    .map(a =>
      parseFloat(Currency.fromRaw(Currency.addRaw(a.balance, a.pending)), 10)
    )
    .reduce((acc, val) => acc + val);

  const burned = _.values(
    (await nano.accounts.balances(BURN_ADDRESSES)).balances
  )
    .map(a =>
      parseFloat(Currency.fromRaw(Currency.addRaw(a.balance, a.pending)), 10)
    )
    .reduce((acc, val) => acc + val);

  const circulating = clientConfig.currency.maxSupply - uncirculating - burned;
  const total = clientConfig.currency.maxSupply - burned;

  return {
    circulating,
    uncirculating,
    burned,
    total
  };
}
