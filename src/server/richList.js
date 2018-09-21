import _ from "lodash";
import { Nano } from "nanode";
import redis from "redis";
import config from "../../server-config.json";

const redisClient = redis.createClient(config.redis);
const nano = new Nano({ url: config.nodeHost });

async function calculateRichList() {
  console.log("Starting rich list update");

  let accountsChecked = 0;
  function accountChecked() {
    accountsChecked++;

    if (accountsChecked % 500 === 0) {
      console.log("Accounts checked:", accountsChecked);
    }
  }

  const frontierCount = (await nano.rpc("frontier_count")).count;
  const data = (await nano.rpc("frontiers", {
    account: "xrb_1111111111111111111111111111111111111111111111111111hifc8npp",
    count: frontierCount
  })).frontiers;

  const accounts = _.keys(data);
  console.log(accounts.length, "accounts");

  const accountChunks = _.chunk(accounts, 5000);
  const accountsWithBalance = [];
  const accountsToRemove = [];
  for (let i = 0; i < accountChunks.length; i++) {
    const resp = await nano.accounts.balances(accountChunks[i]);
    _.forEach(resp.balances, (balances, account) => {
      const balance =
        parseFloat(nano.convert.fromRaw(balances.balance, "mrai"), 10) +
        parseFloat(nano.convert.fromRaw(balances.pending, "mrai"), 10);

      if (parseFloat(balance, 10) === 0) {
        accountsToRemove.push(account);
      } else {
        accountsWithBalance.push([balance, account]);
      }
    });
  }

  const sortedAccounts = accountsWithBalance.sort((a, b) => {
    if (a[0] > b[0]) return -1;
    if (a[0] < b[0]) return 1;
    return 0;
  });

  updateRichList(_.flatten(sortedAccounts), accountsToRemove);
  setTimeout(calculateRichList, 3600000); // every hour
}

function updateRichList(accountsWithBalance, accountsToRemove) {
  const redisKey = `nano-control-panel/${config.redisNamespace ||
    "default"}/sortedAccounts`;
  accountsWithBalance.unshift(redisKey);
  accountsToRemove.unshift(redisKey);
  redisClient.zrem(accountsToRemove, (err, resp) => {
    redisClient.zadd(accountsWithBalance);
  });
}

export default function startRichListUpdate() {
  calculateRichList();
}
