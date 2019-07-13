import _ from "lodash";
import redisFetch from "../../helpers/redisFetch";

export default function(app, nano) {
  /*
   * active_difficulty
   * Returns the current network PoW difficulty level
   * Includes difficulty trend
   */
  app.get("/network/active_difficulty", async (req, res, next) => {
    try {
      const data = await redisFetch(
        "v2/network/active_difficulty",
        10,
        async () => {
          return await nano.rpc("active_difficulty", { include_trend: true });
        }
      );

      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  /*
   * peers
   * Combines peers with confirmation_quorum to tie together peer addresses
   * and representative addresses.
   */
  app.get("/network/peers", async (req, res, next) => {
    try {
      const data = await redisFetch("v2/network/peers", 300, async () => {
        const quorumPeers = (await nano.rpc("confirmation_quorum", {
          peer_details: true
        })).peers;

        const allPeers = (await nano.rpc("peers", { peer_details: true }))
          .peers;

        return _.map(allPeers, (peer, address) => {
          const repInfo = quorumPeers.find(p => p.ip === address);

          return {
            ip: address,
            account: repInfo ? repInfo.account : null,
            weight: repInfo ? repInfo.weight : null,
            protocol_version: peer.protocol_version,
            type: peer.type
          };
        });
      });

      res.json({ peers: data });
    } catch (e) {
      next(e);
    }
  });
}
