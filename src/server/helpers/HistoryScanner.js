import { promisify } from "util";
import redis from "redis";
import { Nano } from "nanode";
import BigNumber from "bignumber.js";
import config from "../../../server-config.json";
import Currency from "../../lib/Currency";

const redisClient = redis.createClient(config.redis);
const hgetall = promisify(redisClient.hgetall.bind(redisClient));
const hmset = promisify(redisClient.hmset.bind(redisClient));

const nano = new Nano({ url: config.nodeHost });

export default class HistoryScanner {
  constructor(account) {
    this.account = account;
    this.redisKey = `nano-control-panel/${config.redisNamespace ||
      "default"}/accountStats/${account}`;

    this.stats = {
      version: 1,
      updatedTo: null,
      rawSent: "0",
      rawReceived: "0",
      largestTransactionAmount: "0",
      largestTransactionHash: null
    };

    this.head = null;
    this.openBlock = null;
  }

  async update() {
    const currentStats = await hgetall(this.redisKey);
    console.log(currentStats);
    if (currentStats !== null && currentStats.version == this.stats.version) {
      this.stats = currentStats;
    }

    const account = await nano.rpc("account_info", { account: this.account });
    if (account && account.open_block) {
      this.openBlock = account.open_block;
    } else {
      return;
    }

    console.log("Starting update");
    await this.beginUpdate();

    return hmset(this.redisKey, this.stats);
  }

  async beginUpdate() {
    let continueFetching = true;
    let resp,
      block,
      i,
      args = {
        account: this.account,
        count: 50000
      };

    while (continueFetching) {
      if (this.head !== null) args.head = this.head;
      console.log("Head:", this.head || "N/A");
      resp = await nano.rpc("account_history", args);

      if (resp === "" || resp.error) {
        console.error(resp.error);
        break;
      }

      // When using the head for pagination, it returns the block with the head hash
      // value first. Since we've already counted that block in the stats once, we want
      // to skip it going forward.
      for (i = this.head === null ? 0 : 1; i < resp.history.length; i++) {
        block = resp.history[i];

        // If we've either hit an open block or we've hit the hash of the end of the
        // last update. We can stop now.
        if (
          block.hash === this.openBlock ||
          block.hash === this.stats.updatedTo
        ) {
          console.log("Finishing at", block.hash);
          continueFetching = false;
          break;
        }

        this.updateStatsForBlock(block);
      }

      // This is our first fetch, so set the updatedTo hash
      if (this.head === null) {
        this.stats.updatedTo = resp.history[0].hash;
      }

      this.head = resp.history[resp.history.length - 1].hash;
    }
  }

  updateStatsForBlock(block) {
    if (
      BigNumber(block.amount).isGreaterThan(
        BigNumber(this.stats.largestTransactionAmount)
      )
    ) {
      this.stats.largestTransactionAmount = block.amount;
      this.stats.largestTransactionHash = block.hash;
    }

    if (block.type === "send") {
      this.stats.rawSent = Currency.addRaw(this.stats.rawSent, block.amount);
    } else if (block.type === "receive") {
      this.stats.rawReceived = Currency.addRaw(
        this.stats.rawReceived,
        block.amount
      );
    }
  }
}
