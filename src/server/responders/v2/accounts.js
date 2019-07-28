import _ from "lodash";
import config from "../../../../server-config.json";
import redisFetch from "../../helpers/redisFetch";
import { accountIsValid, getTimestampForHash } from "../../helpers/util";
import { frontiers, wealthDistribution } from "../../helpers/frontiers";
import Currency from "../../../lib/Currency";

import { BadRequest, NotFound } from "../../errors";

export default function(app, nano) {
  /*
   * account_info
   * General account information
   */
  app.get("/accounts/:account", async (req, res, next) => {
    if (!accountIsValid(req.params.account)) {
      return next(new BadRequest("Invalid account"));
    }

    try {
      const account = await redisFetch(
        `v2/account/${req.params.account}`,
        10,
        async () => {
          const data = await nano.rpc("account_info", {
            account: req.params.account,
            representative: true,
            weight: true,
            pending: true
          });

          if (data.error) {
            switch (data.error) {
              case "Bad account number":
                throw new BadRequest(data.error);
              case "Account not found":
                throw new NotFound(data.error);
              default:
                throw new Error(data.error);
            }
          }

          return data;
        }
      );

      res.json({ account });
    } catch (e) {
      next(e);
    }
  });

  /*
   * account_weight
   * Fetches only account weight
   */
  app.get("/accounts/:account/weight", async (req, res, next) => {
    if (!accountIsValid(req.params.account)) {
      return next(new BadRequest("Invalid account"));
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
      next(e);
    }
  });

  /*
   * delegators
   * Fetches all account delegators
   */
  app.get("/accounts/:account/delegators", async (req, res, next) => {
    if (!accountIsValid(req.params.account)) {
      return next(new BadRequest("Invalid account"));
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
      next(e);
    }
  });

  /*
   * account_history
   * Paginated fetch of account history
   */
  app.get("/accounts/:account/history", async (req, res, next) => {
    if (!accountIsValid(req.params.account)) {
      return next(new BadRequest("Invalid account"));
    }

    if (req.query.head) {
      if (req.query.head.length !== 64 || /[^A-F0-9]+/.test(req.query.head)) {
        return next(new BadRequest("Invalid head block"));
      }
    }

    try {
      const history = await redisFetch(
        `v2/history/${req.params.account}/${req.query.head}`,
        10,
        async () => {
          const resp = await nano.rpc("account_history", {
            account: req.params.account,
            count: 50,
            raw: "true",
            head: req.query.head
          });

          if (resp.error) {
            switch (resp.error) {
              case "Bad account number":
                throw new BadRequest(resp.error);
              default:
                throw new Error(resp.error);
            }
          }

          if (resp.history === "") {
            throw new NotFound("Account not found");
          }

          const { history } = resp;

          for (let i = 0; i < history.length; i++) {
            history[i].timestamp = await getTimestampForHash(history[i].hash);
          }

          return history;
        }
      );

      res.json(history);
    } catch (e) {
      next(e);
    }
  });

  /*
   * accounts_pending
   * Fetches up to 20 pending transactions for an account.
   * Does some extra processing on the response to make it easier for the frontend
   * to utilize.
   */
  app.get("/accounts/:account/pending", async (req, res, next) => {
    if (!accountIsValid(req.params.account)) {
      return next(new BadRequest("Invalid account"));
    }

    try {
      const data = await redisFetch(
        `v3/pending/${req.params.account}`,
        10,
        async () => {
          const resp = await nano.rpc("accounts_pending", {
            accounts: [req.params.account],
            source: true,
            threshold: Currency.toRaw(0.000001),
            sorting: true
          });

          if (resp.error) throw new BadRequest(resp.error);

          // Since it can be unpredictable whether the node returns a xrb_ or nano_ address,
          // and because we know we're only fetching 1 account here, we just grab the first (and only)
          // key in the hash.
          const allBlocks = resp.blocks[_.keys(resp.blocks)[0]];
          const blocks = _.toPairs(allBlocks)
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

          const pendingBalance = (await nano.rpc("account_balance", {
            account: req.params.account
          })).pending;

          return {
            total: _.keys(allBlocks).length,
            blocks,
            pendingBalance
          };
        }
      );

      res.json(data);
    } catch (e) {
      next(e);
    }
  });
}
