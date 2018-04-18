import React, { Fragment } from "react";
import accounting from "accounting";
import AccountLink from "../AccountLink";

const STATUSES = {
  ok: 1000,
  warning: 10000
};

export default function DiscoveredPeers({ peers, stats }) {
  const sortedPeers = peers.sort((a, b) => {
    if (!a.data.nanoNodeName) return 1;
    if (!b.data.nanoNodeName) return -1;
    if (a.data.nanoNodeName < b.data.nanoNodeName) return -1;
    if (a.data.nanoNodeName > b.data.nanoNodeName) return 1;
    return 0;
  });

  return (
    <div className="table-responsive mt-3">
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Checked Blocks</th>
            <th>Unchecked Blocks</th>
            <th>Peers</th>
            <th>Account</th>
          </tr>
        </thead>
        <tbody>
          {sortedPeers.map(peer => (
            <PeerEntry
              key={peer.peer}
              peer={peer}
              currentBlock={stats.currentBlocks.max}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PeerEntry = ({ peer, currentBlock }) => {
  const { url, data } = peer;
  const rootUrl = url.replace("api.php", "");
  const name = data.nanoNodeName ? (
    <Fragment>{data.nanoNodeName}</Fragment>
  ) : (
    <i className="text-muted">Unknown</i>
  );

  const peerBlock = parseInt(data.currentBlock, 10);
  const peerLag = currentBlock - peerBlock;

  let statusClass;
  if (peerLag < STATUSES.ok) {
    statusClass = "text-success";
  } else if (peerLag < STATUSES.warning) {
    statusClass = "text-warning";
  } else {
    statusClass = "text-danger";
  }

  return (
    <tr className={statusClass}>
      <td>
        <a href={rootUrl} className={statusClass} target="_blank">
          {name}
        </a>
      </td>
      <td>{accounting.formatNumber(data.currentBlock)}</td>
      <td>{accounting.formatNumber(data.uncheckedBlocks)}</td>
      <td>{accounting.formatNumber(data.numPeers)}</td>
      <td>
        <AccountLink account={data.nanoNodeAccount} short />
      </td>
    </tr>
  );
};
