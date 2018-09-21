import { promisify } from "es6-promisify";
import redis from "redis";
import config from "../../../server-config.json";

const redisClient = redis.createClient(config.redis);
const zcount = promisify(redisClient.zcount.bind(redisClient));
const zrevrange = promisify(redisClient.zrevrange.bind(redisClient));

export async function wealthDistribution(min, max) {
  return await zcount(
    `nano-control-panel/${config.redisNamespace || "default"}/sortedAccounts`,
    min,
    max
  );
}
