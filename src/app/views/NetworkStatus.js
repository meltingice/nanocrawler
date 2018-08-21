import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import _ from "lodash";
import accounting from "accounting";
import injectClient from "../../lib/ClientComponent";

import AggregateNetworkData from "../partials/AggregateNetworkData";
import NetworkThroughput from "../partials/network/NetworkThroughput";
import PeerVersions from "../partials/PeerVersions";

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

  rebroadcastThreshold() {
    return this.props.config.maxCoinSupply * 0.001;
  }

  rebroadcastableReps() {
    const { representativesOnline } = this.state;
    return _.fromPairs(
      _.toPairs(representativesOnline).filter(rep => {
        return parseFloat(rep[1], 10) >= this.rebroadcastThreshold();
      })
    );
  }

  onlineWeight() {
    const { representativesOnline } = this.state;
    return _.sum(
      _.values(representativesOnline).map(amt => parseFloat(amt, 10))
    );
  }

  onlineRebroadcastWeight() {
    const { representativesOnline } = this.state;
    return _.sum(
      _.values(representativesOnline)
        .map(amt => parseFloat(amt, 10))
        .filter(amt => amt >= this.rebroadcastThreshold())
    );
  }

  rebroadcastPercent() {
    return (
      <Fragment>
        {(
          (this.onlineRebroadcastWeight() / this.props.config.maxCoinSupply) *
          100.0
        ).toFixed(2)}%
      </Fragment>
    );
  }

  onlineRebroadcastPercent() {
    return (
      <Fragment>
        {(
          (this.onlineRebroadcastWeight() / this.onlineWeight()) *
          100.0
        ).toFixed(2)}%
      </Fragment>
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
        {(
          (this.onlineWeight() / this.props.config.maxCoinSupply) *
          100.0
        ).toFixed(2)}%
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
        {(
          (this.officialWeight() / this.props.config.maxCoinSupply) *
          100
        ).toFixed(2)}%
      </Fragment>
    );
  }

  officialOnlinePercent() {
    return (
      <Fragment>
        {((this.officialWeight() / this.onlineWeight()) * 100).toFixed(2)}%
      </Fragment>
    );
  }

  totalBlocks() {
    const { blocksByType } = this.state;
    return _.sum(_.values(blocksByType).map(amt => parseInt(amt, 10)));
  }

  render() {
    const { representativesOnline } = this.state;

    return (
      <div className="p-4">
        <Helmet>
          <title>Network Status</title>
        </Helmet>

        <div className="row align-items-center">
          <div className="col-md">
            <h1>Network Status</h1>
          </div>
        </div>

        <hr />

        <div className="row mt-5">
          <div className="col-md">
            <h2 className="mb-0">
              {accounting.formatNumber(_.keys(representativesOnline).length)}{" "}
              <span className="text-muted">representatives online</span>
            </h2>
            <p className="text-muted">
              Accounts that have at least 1 delegator, regardless of voting
              weight
            </p>

            <h5 className="mb-0">
              {this.amountRepresented()}{" "}
              <span className="text-muted">voting power is online</span>{" "}
            </h5>
            <p>
              {this.percentRepresented()}{" "}
              <span className="text-muted">of the total voting power</span>
            </p>

            <h5 className="mb-0">
              {this.officialRepresented()} NANO{" "}
              <span className="text-muted">
                is delegated to official representatives
              </span>
            </h5>
            <p>
              {this.officialPercent()}{" "}
              <span className="text-muted">of the total voting power and</span>{" "}
              {this.officialOnlinePercent()}{" "}
              <span className="text-muted">of the online voting power</span>
            </p>
          </div>
          <div className="col-md">
            <h2 className="mb-0">
              {accounting.formatNumber(
                _.keys(this.rebroadcastableReps()).length
              )}{" "}
              <span className="text-muted">
                online rebroadcasting representatives
              </span>
            </h2>
            <p className="text-muted">
              A representative will only rebroadcast votes if it's delegated >
              0.1% of the total supply ({accounting.formatNumber(
                this.rebroadcastThreshold()
              )}{" "}
              NANO)
            </p>

            <h5 className="mb-0">
              {accounting.formatNumber(this.onlineRebroadcastWeight())} NANO{" "}
              <span className="text-muted">
                is assigned to rebroadcasting representatives
              </span>{" "}
            </h5>
            <p className="mb-0">
              {this.rebroadcastPercent()}{" "}
              <span className="text-muted">of the total voting power and</span>{" "}
              {this.onlineRebroadcastPercent()}{" "}
              <span className="text-muted">of the online voting power</span>
            </p>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md">
            <NetworkThroughput />
          </div>
          <div className="col-md mt-3 mt-md-0">
            <PeerVersions peers={this.state.peers} />
          </div>
        </div>

        <AggregateNetworkData />
      </div>
    );
  }
}

export default injectClient(NetworkStatus);
