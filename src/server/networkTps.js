import { Nano } from "nanode";
import { promisify } from "es6-promisify";
import redis from "redis";
import config from "../../server-config.json";

const redisClient = redis.createClient(config.redis);

const nano = new Nano({ url: config.nodeHost });
const STORAGE_PERIOD = 60 * 60 * 24 * 7 * 1000; // 1 week
const STORAGE_KEY = `nano-control-panel/${config.redisNamespace ||
  "default"}/networkTps`;

function recordBlockCount() {
  setTimeout(async () => {
    const blockCounts = await nano.blocks.count();
    const now = new Date().getTime();

    console.log("Recording block count:", blockCounts.count);
    redisClient.zadd(STORAGE_KEY, now, parseInt(blockCounts.count, 10), () => {
      redisClient.zremrangebyscore(
        STORAGE_KEY,
        "-inf",
        now - STORAGE_PERIOD,
        recordBlockCount
      );
    });
  }, 10000);
}

export default function networkTps() {
  if (config.redis) recordBlockCount();
}
