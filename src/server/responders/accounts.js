import _ from "lodash";
import config from "../../../server-config.json";
import redisFetch from "../helpers/redisFetch";
import { accountIsValid } from "../helpers/util";

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
        60,
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

  app.get("/weight/:account", async (req, res) => {
    if (!accountIsValid(req.params.account)) {
      return res.status(400).send({ error: "Invalid account" });
    }

    try {
      const weight = await redisFetch(
        `weight/${req.params.account}`,
        600,
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

  app.get("/delegators/:account", async (req, res) => {
    if (!accountIsValid(req.params.account)) {
      return res.status(400).send({ error: "Invalid account" });
    }

    try {
      const delegators = await redisFetch(
        `delegators/${req.params.account}`,
        3600,
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

  app.get("/history/:account", async (req, res) => {
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
        60,
        async () => {
          // const resp = await nano.accounts.history(req.params.account, 20);
          const resp = (await nano.rpc("account_history", {
            account: req.params.account,
            count: 20,
            raw: "true",
            head: req.query.head
          })).history;
          return resp.map(block => {
            if (block.amount) {
              block.amount = nano.convert.fromRaw(block.amount, "mrai");
            }

            return block;
          });
        }
      );

      res.json(history);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });
}
