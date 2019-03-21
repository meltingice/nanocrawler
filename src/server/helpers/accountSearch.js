import { promisify } from "util";
import redis from "redis";
import serverConfig from "../../../server-config.json";
import clientConfig from "../../client-config.json";

let redisClient, redisSscan;
const redisKey = `nano-control-panel/${serverConfig.redisNamespace ||
  "default"}/allAccounts`;

if (serverConfig.redis) {
  redisClient = redis.createClient(serverConfig.redis);
  redisClient.on("error", err => {
    console.error("Redis unavailable");
  });

  redisSscan = promisify(redisClient.sscan.bind(redisClient));
}

const accountSearch = async query => {
  if (!redisClient || !redisClient.connected) return [];

  const search = formatQuery(query);
  if (search === null) return [];

  let results = [];
  let cursor = "0";

  do {
    const resp = await redisSscan(
      redisKey,
      cursor,
      "MATCH",
      search,
      "COUNT",
      20000
    );

    cursor = resp[0];

    const accounts = resp[1];
    results = results.concat(accounts);
  } while (cursor !== "0");

  return results.sort(sortResults(query));
};

const formatQuery = query => {
  const prefixes = clientConfig.currency.prefixes
    .map(pre => `${pre}_`)
    .join("|");

  const addressRegex = new RegExp(
    `^(?:${prefixes})?[13]?([13456789abcdefghijkmnopqrstuwxyz]+)$`
  );

  const match = query.toLowerCase().match(addressRegex);
  if (match) return `*_[13]*${match[1]}*`;
  return null;
};

const sortResults = query => {
  return (a, b) => a.indexOf(query) - b.indexOf(query);
};

export default accountSearch;
