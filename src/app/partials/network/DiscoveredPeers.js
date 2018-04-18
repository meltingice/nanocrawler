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
      <table className="table">
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
              peer={peer.data}
              currentBlock={stats.currentBlocks.max}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PeerEntry = ({ peer, currentBlock }) => {
  const name = peer.nanoNodeName ? (
    <Fragment>{peer.nanoNodeName}</Fragment>
  ) : (
    <i className="text-muted">Unknown</i>
  );

  const peerBlock = parseInt(peer.currentBlock, 10);
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
      <td>{name}</td>
      <td>{accounting.formatNumber(peer.currentBlock)}</td>
      <td>{accounting.formatNumber(peer.uncheckedBlocks)}</td>
      <td>{accounting.formatNumber(peer.numPeers)}</td>
      <td>
        <AccountLink account={peer.nanoNodeAccount} short />
      </td>
    </tr>
  );
};
