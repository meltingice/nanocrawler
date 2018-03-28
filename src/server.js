import os from 'os'
import Promise from 'promise'

import { Nano } from 'nanode'
import express from 'express'
import cors from 'cors'
import { promisify } from 'es6-promisify'
import redis from 'redis'

import config from '../config.json'

let redisClient, redisGet, redisSet;
if (config.redis) {
  redisClient = redis.createClient(config.redis);
  redisGet = promisify(redisClient.get.bind(redisClient));
  redisSet = promisify(redisClient.set.bind(redisClient));
}

const nano = new Nano({ url: config.nodeHost })

const app = express();
app.use(cors())

const redisFetch = async (key, expire, func) => {
  if (!redisClient) return func();
  const namespacedKey = `nano-control-panel/${key}`;
  const resp = await redisGet(namespacedKey);
  if (resp === null) {
    const result = await Promise.resolve(func());
    redisSet(namespacedKey, JSON.stringify(result), 'EX', expire);
    return result;
  } else {
    return JSON.parse(resp);
  }
}

app.get('/', (req, res) => {
  res.send("Hello, world!")
});

app.get('/account', async (req, res) => {
  res.json({ account: config.account })
});

app.get('/weight', async (req, res) => {
  const weight = await redisFetch('weight', 300, async () => {
    return nano.convert.fromRaw(await nano.accounts.weight(config.account), 'mrai')
  })

  res.json({ weight });
});

app.get('/block_count', async (req, res) => {
  const blockCount = await redisFetch('blockCount', 10, async () => {
    return await nano.blocks.count();
  })

  res.json({ blockCount });
})

app.get('/version', async (req, res) => {
  const version = await redisFetch('version', 3600, async () => {
    return await nano.rpc('version');
  })

  res.json(version);
});

app.get('/delegators_count', async (req, res) => {
  const delegatorsCount = await redisFetch('delegatorsCount', 300, async () => {
    return await nano.rpc('delegators_count', { account: config.account });
  })

  res.json(delegatorsCount);
});

app.get('/system_info', async (req, res) => {
  res.json({
    uptime: os.uptime(),
    loadAvg: os.loadavg(),
    memory: {
      free: os.freemem(),
      total: os.totalmem()
    }
  });
});

app.listen(3001);
