import React, { Fragment } from "react";
import accounting from "accounting";
import AccountLink from "../AccountLink";

export default function DiscoveredPeers({ peers }) {
  const sortedPeers = peers.sort((a, b) => {
    const blocksA = parseInt(a.data.currentBlock, 10);
    const blocksB = parseInt(b.data.currentBlock, 10);

    if (blocksA > blocksB) return -1;
    if (blocksA < blocksB) return 1;
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
            <PeerEntry key={peer.peer} peer={peer.data} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PeerEntry = ({ peer }) => {
  const name = peer.nanoNodeName ? (
    <Fragment>{peer.nanoNodeName}</Fragment>
  ) : (
    <i className="text-muted">Unknown</i>
  );
  return (
    <tr>
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
