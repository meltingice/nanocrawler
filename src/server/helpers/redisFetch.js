import { promisify } from "util";
import redis from "redis";
import config from "../../../server-config.json";

let redisClient, redisGet, redisSet;
if (config.redis) {
  redisClient = redis.createClient(config.redis);
  redisClient.on("error", err => {
    console.error("Redis unavailable");
  });

  redisGet = promisify(redisClient.get.bind(redisClient));
  redisSet = promisify(redisClient.set.bind(redisClient));
}

const redisFetch = async (key, expire, func) => {
  if (!redisClient || !redisClient.connected) return func();
  const namespacedKey = `nano-control-panel/${config.redisNamespace ||
    "default"}/${key}`;
  const resp = await redisGet(namespacedKey);
  if (resp === null) {
    const result = await Promise.resolve(func());
    redisSet(namespacedKey, JSON.stringify(result), "EX", expire);
    return result;
  } else {
    return JSON.parse(resp);
  }
};

export default redisFetch;
export { redisGet };
