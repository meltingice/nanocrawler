import _ from "lodash";
import { Nano } from "nanode";
import redis from "redis";
import parallelLimit from "async/parallelLimit";
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

  parallelLimit(
    accounts.map(account => {
      return callback => {
        return nano.accounts.nanoBalance(account).then(balance => {
          accountChecked();
          callback(null, [account, parseFloat(balance, 10)]);
        });
      };
    }),
    500,
    (err, accountsWithBalance) => {
      if (err) console.error(err);

      accountsWithBalance.sort((a, b) => {
        if (a[1] > b[1]) return -1;
        if (a[1] < b[1]) return 1;
        return 0;
      });

      updateRichList(_.fromPairs(accountsWithBalance.slice(0, 100)));
      setTimeout(calculateRichList, 3600000); // every hour
    }
  );
}

function updateRichList(accounts) {
  console.log(accounts);
  redisClient.set(
    `nano-control-panel/${config.redisNamespace || "default"}/richList`,
    JSON.stringify(accounts)
  );
}

export default function startRichListUpdate() {
  calculateRichList();
}
