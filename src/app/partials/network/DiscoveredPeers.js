import React, { Fragment } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import _ from "lodash";
import AccountLink from "../AccountLink";
import OptionalField from "../OptionalField";

const STATUSES = {
  ok: 1000,
  warning: 10000
};

export default class DiscoveredPeers extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      repsOnly: false,
      sortVersion: ""
    };
  }

  filteredPeers() {
    const { peers } = this.props;
    const { repsOnly, sortVersion } = this.state;

    return peers.filter(peer => {
      let status = true;
      if (repsOnly) {
        status = peer.data.votingWeight && peer.data.votingWeight >= 133248.289;
      }

      if (sortVersion) {
        status =
          status &&
          peer.data.version &&
          peer.data.version.match(
            new RegExp(`${sortVersion.replace(".", ".")}$`)
          );
      }

      return status;
    });
  }

  sortedPeers() {
    return this.filteredPeers().sort((a, b) => {
      if (!a.data.nanoNodeName) return 1;
      if (!b.data.nanoNodeName) return -1;
      if (a.data.nanoNodeName < b.data.nanoNodeName) return -1;
      if (a.data.nanoNodeName > b.data.nanoNodeName) return 1;
      return 0;
    });
  }

  versions() {
    return _.uniq(
      _.compact(
        this.props.peers.map(peer => {
          if (!peer.data.version) return null;
          const match = peer.data.version.match(/(\d+\.\d+)/);
          return match ? match[1] : null;
        })
      ).sort()
    );
  }

  render() {
    const { stats } = this.props;
    const sortedPeers = this.sortedPeers();

    return (
      <Fragment>
        <div className="form-row align-items-center mt-3 mt-sm-0">
          <div className="col-auto">
            <select
              className="form-control"
              value={this.state.sortVersion}
              onChange={e => this.setState({ sortVersion: e.target.value })}
            >
              <option value="">
                <FormattedMessage id="network.peers.filter" />
              </option>
              {this.versions().map(version => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>
          </div>
          <div className="col-auto">
            <div className="form-check">
              <label className="form-check-label">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={this.state.repsOnly}
                  id="PeerListRepsOnly"
                  onChange={e => this.setState({ repsOnly: e.target.checked })}
                  style={{ marginTop: "0.2rem" }}
                />
                <FormattedMessage id="network.peers.rebroadcast_only" />
              </label>
            </div>
          </div>
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-sm">
            <thead>
              <tr>
                <th className="text-capitalize">
                  <FormattedMessage id="name" />
                </th>
                <th>
                  <FormattedMessage id="status.checked_blocks" />
                </th>
                <th>
                  <FormattedMessage id="status.unchecked_blocks" />
                </th>
                <th>
                  <FormattedMessage id="status.voting_weight" />
                </th>
                <th>
                  <FormattedMessage id="status.peers" />
                </th>
                <th className="text-capitalize">
                  <FormattedMessage id="version" />
                </th>
                <th className="text-capitalize">
                  <FormattedMessage id="account" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPeers.map(peer => (
                <PeerEntry
                  key={peer.url}
                  peer={peer}
                  currentBlock={stats.currentBlocks.max}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

const PeerEntry = ({ peer, currentBlock }) => {
  const { url, data } = peer;
  const rootUrl = url.replace("api.php", "");

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
          <OptionalField value={data.nanoNodeName} />
        </a>
      </td>
      <td>
        <FormattedNumber value={data.currentBlock} />
      </td>
      <td>
        <FormattedNumber value={data.uncheckedBlocks} />
      </td>
      <td>
        <OptionalField value={data.votingWeight}>
          {value => (
            <Fragment>
              <FormattedNumber value={value} maximumFractionDigits={2} /> NANO
            </Fragment>
          )}
        </OptionalField>
      </td>
      <td>
        <OptionalField value={data.numPeers}>
          {value => <FormattedNumber value={value} />}
        </OptionalField>
      </td>
      <td>
        <OptionalField value={data.version} />
      </td>
      <td>
        <AccountLink account={data.nanoNodeAccount} short />
      </td>
    </tr>
  );
};
