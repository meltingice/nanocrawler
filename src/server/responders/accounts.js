import _ from "lodash";
import config from "../../../server-config.json";
import redisFetch from "../helpers/redisFetch";
import { accountIsValid, getTimestampForHash } from "../helpers/util";
import { frontiers, wealthDistribution } from "../helpers/frontiers";

export default function(app, nano) {
  app.get("/account", async (req, res) => {
    res.json({ account: config.account });
  });

  app.get("/account/:account", async (req, res) => {
    if (!accountIsValid(req.params.account)) {
      return res.status(400).send({ error: "Invalid account" });
    }

    try {
      const account = await redisFetch(
        `account/${req.params.account}`,
        10,
        async () => {
          const account = await nano.rpc("account_info", {
            account: req.params.account,
            representative: true,
            weight: true,
            pending: true
          });

          account.balance = nano.convert.fromRaw(account.balance, "mrai");
          account.pending = nano.convert.fromRaw(account.pending, "mrai");
          account.weight = nano.convert.fromRaw(account.weight, "mrai");

          return account;
        }
      );

      res.json({ account });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  app.get("/account/:account/weight", async (req, res) => {
    if (!accountIsValid(req.params.account)) {
      return res.status(400).send({ error: "Invalid account" });
    }

    try {
      const weight = await redisFetch(
        `weight/${req.params.account}`,
        300,
        async () => {
          return nano.convert.fromRaw(
            await nano.accounts.weight(req.params.account),
            "mrai"
          );
        }
      );

      res.json({ weight });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  app.get("/account/:account/delegators", async (req, res) => {
    if (!accountIsValid(req.params.account)) {
      return res.status(400).send({ error: "Invalid account" });
    }

    try {
      const delegators = await redisFetch(
        `delegators/${req.params.account}`,
        300,
        async () => {
          const resp = await nano.rpc("delegators", {
            account: req.params.account
          });
          return _.fromPairs(
            _.map(resp.delegators, (balance, account) => {
              return [account, nano.convert.fromRaw(balance, "mrai")];
            })
          );
        }
      );

      res.json(delegators);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  app.get("/account/:account/history", async (req, res) => {
    if (!accountIsValid(req.params.account)) {
      return res.status(400).send({ error: "Invalid account" });
    }

    if (req.query.head) {
      if (req.query.head.length !== 64 || /[^A-F0-9]+/.test(req.query.head)) {
        return res.status(400).send({ error: "Invalid head block" });
      }
    }

    try {
      const history = await redisFetch(
        `history/${req.params.account}/${req.query.head}`,
        10,
        async () => {
          // const resp = await nano.accounts.history(req.params.account, 20);
          const resp = (await nano.rpc("account_history", {
            account: req.params.account,
            count: 50,
            raw: "true",
            head: req.query.head
          })).history;

          for (let i = 0; i < resp.length; i++) {
            resp[i].timestamp = await getTimestampForHash(resp[i].hash);
            if (resp[i].amount) {
              resp[i].amount = nano.convert.fromRaw(resp[i].amount, "mrai");
            }
          }

          return resp;
        }
      );

      res.json(history);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  app.get("/account/:account/pending", async (req, res) => {
    if (!accountIsValid(req.params.account)) {
      return res.status(400).send({ error: "Invalid account" });
    }

    try {
      const data = await redisFetch(
        `pending/${req.params.account}`,
        10,
        async () => {
          const resp = await nano.rpc("accounts_pending", {
            accounts: [req.params.account],
            source: true,
            threshold: nano.convert.toRaw(0.000001, "mrai")
          });

          const blocks = _.toPairs(resp.blocks[req.params.account])
            .slice(0, 20)
            .map(data => {
              return {
                type: "pending",
                amount: nano.convert.fromRaw(data[1].amount, "mrai"),
                hash: data[0],
                source: data[1].source
              };
            });

          for (let i = 0; i < blocks.length; i++) {
            blocks[i].timestamp = await getTimestampForHash(blocks[i].hash);
          }

          return {
            total: _.keys(resp.blocks[req.params.account]).length,
            blocks
          };
        }
      );

      res.json(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  app.get("/accounts/:page(\\d+)", async (req, res) => {
    try {
      const data = await frontiers(req.params.page);
      res.json(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  app.get("/accounts/distribution", async (req, res) => {
    try {
      const distribution = {
        1: await wealthDistribution(0, 1),
        10: await wealthDistribution(1, 10),
        100: await wealthDistribution(10, 100),
        1000: await wealthDistribution(100, 1000),
        10000: await wealthDistribution(1000, 10000),
        100000: await wealthDistribution(10000, 100000),
        1000000: await wealthDistribution(100000, 1000000),
        10000000: await wealthDistribution(1000000, 10000000),
        100000000: await wealthDistribution(10000000, 100000000)
      };

      res.json({ distribution });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });
}
