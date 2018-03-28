import { Nano } from 'nanode'
import express from 'express'
import cors from 'cors'

import config from '../config.json'

const nano = new Nano({ url: config.nodeHost })

const app = express();
app.use(cors())

app.get('/', (req, res) => {
  res.send("Hello, world!")
});

app.get('/account', async (req, res) => {
  res.json({ account: config.account })
});

app.get('/weight', async (req, res) => {
  res.json({
    weight: nano.convert.fromRaw(await nano.accounts.weight(config.account), 'mrai')
  });
});

app.get('/block_count', async (req, res) => {
  res.json({ blockCount: await nano.blocks.count() })
})

app.get('/version', async (req, res) => {
  res.json(await nano.rpc('version'))
});

app.get('/delegators_count', async (req, res) => {
  res.json(await nano.rpc('delegators_count', { account: config.account }))
});

app.listen(3001);
