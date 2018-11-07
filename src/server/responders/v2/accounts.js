import _ from "lodash";
import config from "../../../../server-config.json";
import redisFetch from "../../helpers/redisFetch";
import { accountIsValid, getTimestampForHash } from "../../helpers/util";
import { frontiers, wealthDistribution } from "../../helpers/frontiers";

export default function(app, nano) {
  /*
   * account_info
   * General account information
   */
  app.get("/accounts/:account", async (req, res) => {
    if (!accountIsValid(req.params.account)) {
      return res.status(400).send({ error: "Invalid account" });
    }

    try {
      const account = await redisFetch(
        `v2/account/${req.params.account}`,
        10,
        async () => {
          return await nano.rpc("account_info", {
            account: req.params.account,
            representative: true,
            weight: true,
            pending: true
          });
        }
      );

      res.json({ account });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  /*
   * account_weight
   * Fetches only account weight
   */
  app.get("/accounts/:account/weight", async (req, res) => {
    if (!accountIsValid(req.params.account)) {
      return res.status(400).send({ error: "Invalid account" });
    }

    try {
      const weight = await redisFetch(
        `v2/weight/${req.params.account}`,
        300,
        async () => {
          return await nano.accounts.weight(req.params.account);
        }
      );

      res.json({ weight });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  /*
   * delegators
   * Fetches all account delegators
   */
  app.get("/accounts/:account/delegators", async (req, res) => {
    if (!accountIsValid(req.params.account)) {
      return res.status(400).send({ error: "Invalid account" });
    }

    try {
      const delegators = await redisFetch(
        `v2/delegators/${req.params.account}`,
        300,
        async () => {
          return await nano.rpc("delegators", {
            account: req.params.account
          });
        }
      );

      res.json(delegators);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  /*
   * account_history
   * Paginated fetch of account history
   */
  app.get("/accounts/:account/history", async (req, res) => {
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
        `v2/history/${req.params.account}/${req.query.head}`,
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
          }

          return resp;
        }
      );

      res.json(history);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  /*
   * accounts_pending
   * Fetches up to 20 pending transactions for an account.
   * Does some extra processing on the response to make it easier for the frontend
   * to utilize.
   */
  app.get("/accounts/:account/pending", async (req, res) => {
    if (!accountIsValid(req.params.account)) {
      return res.status(400).send({ error: "Invalid account" });
    }

    try {
      const data = await redisFetch(
        `v2/pending/${req.params.account}`,
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
                amount: data[1].amount,
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
}
