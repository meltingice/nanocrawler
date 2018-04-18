import React, { Fragment } from "react";
import _ from "lodash";
import accounting from "accounting";
import injectClient from "../../lib/ClientComponent";

import AggregateNetworkData from "../partials/AggregateNetworkData";
import BlockByTypeStats from "../partials/BlockByTypeStats";
import PeerVersions from "../partials/PeerVersions";

const MAX_SUPPLY = 133248289;

class NetworkStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      blocksByType: {},
      peers: {},
      representativesOnline: {},
      officialRepresentatives: {}
    };

    this.statTimer = null;
  }

  componentWillMount() {
    this.updateStats();
  }

  componentWillUnmount() {
    if (this.statTimer) clearTimeout(this.statTimer);
  }

  async updateStats() {
    this.setState({
      blocksByType: await this.props.client.blockCountByType(),
      peers: await this.props.client.peers(),
      representativesOnline: await this.props.client.representativesOnline(),
      officialRepresentatives: await this.props.client.officialRepresentatives()
    });

    this.statTimer = setTimeout(this.updateStats.bind(this), 10000);
  }

  onlineWeight() {
    const { representativesOnline } = this.state;
    return _.sum(
      _.values(representativesOnline).map(amt => parseFloat(amt, 10))
    );
  }

  officialWeight() {
    const { officialRepresentatives } = this.state;
    return _.sum(
      _.values(officialRepresentatives).map(amt => parseFloat(amt, 10))
    );
  }

  amountRepresented() {
    return (
      <Fragment>{accounting.formatNumber(this.onlineWeight())} NANO</Fragment>
    );
  }

  percentRepresented() {
    return (
      <Fragment>
        {(this.onlineWeight() / MAX_SUPPLY * 100.0).toFixed(2)}%
      </Fragment>
    );
  }

  officialRepresented() {
    return (
      <Fragment>{accounting.formatNumber(this.officialWeight())}</Fragment>
    );
  }

  officialPercent() {
    return (
      <Fragment>
        {(this.officialWeight() / MAX_SUPPLY * 100).toFixed(2)}%
      </Fragment>
    );
  }

  officialOnlinePercent() {
    return (
      <Fragment>
        {(this.officialWeight() / this.onlineWeight() * 100).toFixed(2)}%
      </Fragment>
    );
  }

  render() {
    const { representativesOnline } = this.state;

    return (
      <div className="p-4">
        <div className="row align-items-center">
          <div className="col-md">
            <h1>Network Status</h1>
          </div>
        </div>

        <hr />

        <div className="row mt-5">
          <div className="col">
            <h2>
              {accounting.formatNumber(_.keys(representativesOnline).length)}{" "}
              <span className="text-muted">representatives online</span>
            </h2>
            <h5>
              {this.amountRepresented()}{" "}
              <span className="text-muted">
                voting power is online, which is
              </span>{" "}
              {this.percentRepresented()}{" "}
              <span className="text-muted">of the total voting power</span>
            </h5>
            <h5>
              {this.officialRepresented()} NANO{" "}
              <span className="text-muted">
                is delegated to official representatives, which is
              </span>{" "}
              {this.officialPercent()}{" "}
              <span className="text-muted">of the total voting power and</span>{" "}
              {this.officialOnlinePercent()}{" "}
              <span className="text-muted">of the online voting power</span>
            </h5>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md">
            <h2>Block Stats</h2>
            {this.getBlocksByType()}
          </div>
          <div className="col-md mt-3 mt-md-0">
            <PeerVersions peers={this.state.peers} />
          </div>
        </div>

        <AggregateNetworkData />
      </div>
    );
  }

  getBlocksByType() {
    const { blocksByType } = this.state;

    return _.map(blocksByType, (count, type) => {
      return <BlockByTypeStats key={type} type={type} count={count} />;
    });
  }
}

export default injectClient(NetworkStatus);
