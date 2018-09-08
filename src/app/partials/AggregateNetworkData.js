import React, { Fragment } from "react";
import _ from "lodash";
import accounting from "accounting";
import { FormattedMessage, FormattedNumber } from "react-intl";
import injectClient from "../../lib/ClientComponent";

import DiscoveredPeers from "./network/DiscoveredPeers";

class AggregateNetworkData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      peers: []
    };

    this.timeout = null;
  }

  componentWillMount() {
    this.updateStats();
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  async updateStats() {
    const peers = await this.props.client.networkData();
    this.setState({ peers });
    this.timeout = setTimeout(this.updateStats.bind(this), 10000);
  }

  blockStats() {
    const currentBlocks = _.compact(
      this.representativePeers().map(peer =>
        parseInt(peer.data.currentBlock, 10)
      )
    );
    const uncheckedBlocks = _.compact(
      this.representativePeers().map(peer =>
        parseInt(peer.data.uncheckedBlocks, 10)
      )
    );

    return {
      currentBlocks: {
        mean: Math.round(_.mean(currentBlocks)),
        median: this._median(currentBlocks),
        min: _.min(currentBlocks),
        max: _.max(currentBlocks)
      },
      uncheckedBlocks: {
        mean: Math.round(_.mean(uncheckedBlocks)),
        median: this._median(uncheckedBlocks),
        min: _.min(uncheckedBlocks),
        max: _.max(uncheckedBlocks)
      }
    };
  }

  representativePeers() {
    const { peers } = this.state;
    return peers.filter(
      peer => peer.data.votingWeight && peer.data.votingWeight >= 0
    );
  }

  servicePeers() {
    const { config } = this.props;
    const { peers } = this.state;

    return peers.filter(peer => config.serviceMonitors.includes(peer.url));
  }

  render() {
    if (this.state.peers.length === 0) return null;
    const blockStats = this.blockStats();

    return (
      <Fragment>
        <div className="row mt-5 align-items-center">
          <div className="col-md">
            <h1 className="mb-0">
              <FormattedMessage id="network.aggregate.title" />
            </h1>
            <p className="text-muted mb-0">
              <FormattedMessage
                id="network.aggregate.desc"
                values={{
                  link: (
                    <a
                      href="https://github.com/NanoTools/nanoNodeMonitor"
                      target="_blank"
                    >
                      nanoNodeMonitors
                    </a>
                  )
                }}
              />
            </p>
          </div>
          <div className="col-auto">
            <h4 className="text-muted mb-0">
              <FormattedMessage
                id="network.tracking_nodes"
                values={{ count: this.representativePeers().length }}
              />
            </h4>
          </div>
        </div>

        <hr />

        <div className="row mt-5">
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <FormattedMessage id="network.avg_sync_status" />
            </p>
            <h3>
              {Math.round(
                (blockStats.currentBlocks.mean / blockStats.currentBlocks.max) *
                  10000
              ) / 100}%
            </h3>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <FormattedMessage id="network.avg_block_count" />
            </p>
            <h3>
              <FormattedNumber
                value={blockStats.currentBlocks.mean}
                minimumFractionDigits={0}
              />
            </h3>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <FormattedMessage id="network.median_block_count" />
            </p>
            <h3>
              <FormattedNumber
                value={blockStats.currentBlocks.median}
                minimumFractionDigits={0}
              />
            </h3>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <FormattedMessage id="network.minimum_block_count" />
            </p>
            <h3>
              <FormattedNumber
                value={blockStats.currentBlocks.min}
                minimumFractionDigits={0}
              />
            </h3>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <FormattedMessage id="network.maximum_block_count" />
            </p>
            <h3>
              <FormattedNumber
                value={blockStats.currentBlocks.max}
                minimumFractionDigits={0}
              />
            </h3>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <FormattedMessage id="network.avg_percent_uncheckeed" />
            </p>
            <h3>
              {Math.round(
                (blockStats.uncheckedBlocks.mean /
                  (blockStats.currentBlocks.mean +
                    blockStats.uncheckedBlocks.mean)) *
                  10000
              ) / 100}%
            </h3>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <FormattedMessage id="network.avg_unchecked" />
            </p>
            <h3>
              <FormattedNumber
                value={blockStats.uncheckedBlocks.mean}
                minimumFractionDigits={0}
              />
            </h3>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <FormattedMessage id="network.median_unchecked" />
            </p>
            <h3>
              <FormattedNumber
                value={blockStats.uncheckedBlocks.median}
                minimumFractionDigits={0}
              />
            </h3>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <FormattedMessage id="network.min_unchecked" />
            </p>
            <h3>
              <FormattedNumber
                value={blockStats.uncheckedBlocks.min}
                minimumFractionDigits={0}
              />
            </h3>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <FormattedMessage id="network.max_unchecked" />
            </p>
            <h3>
              <FormattedNumber
                value={blockStats.uncheckedBlocks.max}
                minimumFractionDigits={0}
              />
            </h3>
          </div>
        </div>

        <div className="row mt-5 align-items-center">
          <div className="col-sm">
            <h3 className="mb-0">
              <FormattedMessage id="network.nano_services" />
            </h3>
            <p className="text-muted mb-0">
              <FormattedMessage id="network.nano_services_desc" />
            </p>
            <p>
              <small>
                <FormattedMessage id="network.synced_within" />{" "}
                <span className="text-success">
                  <FormattedMessage
                    id="network.synced_blocks"
                    values={{ count: <FormattedNumber value={1000} /> }}
                  />
                </span>{" "}
                <span className="text-warning">
                  <FormattedMessage
                    id="network.synced_blocks"
                    values={{ count: <FormattedNumber value={10000} /> }}
                  />
                </span>{" "}
                <span className="text-danger">
                  <FormattedMessage
                    id="network.synced_greater_than"
                    values={{ count: <FormattedNumber value={10000} /> }}
                  />
                </span>
              </small>
            </p>
          </div>
        </div>

        <DiscoveredPeers peers={this.servicePeers()} stats={blockStats} />

        <div className="row mt-5 align-items-center">
          <div className="col-sm">
            <h3 className="mb-0">Discovered Peers</h3>
            <p className="text-muted mb-0">
              All discovered peers running nanoNodeMonitor, sorted by name.
            </p>
            <p>
              <small>
                Synced within:{" "}
                <span className="text-success">1,000 blocks</span>{" "}
                <span className="text-warning">10,000 blocks</span>{" "}
                <span className="text-danger">greater than 10,000 blocks</span>
              </small>
            </p>
          </div>
          <div className="col-auto">
            <h4 className="text-muted mb-0">
              {this.state.peers.length} monitors discovered
            </h4>
          </div>
        </div>

        <DiscoveredPeers peers={this.state.peers} stats={blockStats} />
      </Fragment>
    );
  }

  _median(arr) {
    const sortedArr = arr.sort();
    if (sortedArr.length % 2 === 0) {
      return Math.round(
        (sortedArr[Math.floor((arr.length - 1) / 2)] +
          sortedArr[Math.ceil((arr.length - 1) / 2)]) /
          2
      );
    } else {
      return sortedArr[(arr.length - 1) / 2];
    }
  }
}

export default injectClient(AggregateNetworkData);
