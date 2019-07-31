import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";
import keys from "lodash/keys";
import sum from "lodash/sum";
import values from "lodash/values";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";
import { withNetworkData } from "lib/NetworkContext";

import AggregateNetworkData from "../partials/AggregateNetworkData";
import NetworkThroughput from "../partials/network/NetworkThroughput";
import NetworkDifficulty from "../partials/network/NetworkDifficulty";
import NetworkConfirmationQuorum from "../partials/network/NetworkConfirmationQuorum";
import NetworkConfirmationHistory from "../partials/network/NetworkConfirmationHistory";
import PeerVersions from "../partials/PeerVersions";

import { apiClient } from "lib/Client";
import Currency from "lib/Currency";
import config from "client-config.json";

class NetworkStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      officialRepresentatives: await apiClient.officialRepresentatives()
    });

    this.statTimer = setTimeout(this.updateStats.bind(this), 60000);
  }

  rebroadcastThreshold() {
    const { onlineStake } = this.props.network;
    return Currency.fromRaw(onlineStake) * 0.001;
  }

  rebroadcastableReps() {
    const { representativesOnline } = this.props.network;
    return fromPairs(
      toPairs(representativesOnline).filter(rep => {
        return Currency.fromRaw(rep[1]) >= this.rebroadcastThreshold();
      })
    );
  }

  onlineWeight() {
    const { onlineStake } = this.props.network;
    return Currency.fromRaw(onlineStake);
  }

  onlineRebroadcastWeight() {
    const { representativesOnline } = this.props.network;
    return sum(
      values(representativesOnline)
        .map(amt => Currency.fromRaw(amt))
        .filter(amt => amt >= this.rebroadcastThreshold())
    );
  }

  rebroadcastPercent() {
    return (
      <Fragment>
        {(
          (this.onlineRebroadcastWeight() / config.currency.maxSupply) *
          100.0
        ).toFixed(2)}
        %
      </Fragment>
    );
  }

  onlineRebroadcastPercent() {
    return (
      <Fragment>
        {(
          (this.onlineRebroadcastWeight() / this.onlineWeight()) *
          100.0
        ).toFixed(2)}
        %
      </Fragment>
    );
  }

  officialWeight() {
    const { officialRepresentatives } = this.state;
    return sum(
      values(officialRepresentatives).map(amt => Currency.fromRaw(amt))
    );
  }

  amountRepresented() {
    return (
      <Fragment>
        <FormattedNumber
          value={this.onlineWeight()}
          maximumFractionDigits={0}
        />{" "}
        {config.currency.shortName}
      </Fragment>
    );
  }

  percentRepresented() {
    return (
      <Fragment>
        <FormattedNumber
          value={(this.onlineWeight() / config.currency.maxSupply) * 100.0}
          maximumFractionDigits={2}
        />
        %
      </Fragment>
    );
  }

  officialRepresented() {
    return (
      <Fragment>
        <FormattedNumber
          value={this.officialWeight()}
          maximumFractionDigits={0}
        />{" "}
        {config.currency.shortName}
      </Fragment>
    );
  }

  officialPercent() {
    return (
      <Fragment>
        <FormattedNumber
          value={(this.officialWeight() / config.currency.maxSupply) * 100}
          maximumFractionDigits={2}
        />
        %
      </Fragment>
    );
  }

  officialOnlinePercent() {
    return (
      <Fragment>
        <FormattedNumber
          value={(this.officialWeight() / this.onlineWeight()) * 100}
          maximumFractionDigits={2}
        />
        %
      </Fragment>
    );
  }

  render() {
    const { representativesOnline } = this.props.network;

    return (
      <div className="p-4">
        <Helmet title="Network Status" />

        <div className="row align-items-center">
          <div className="col-md">
            <h1>
              <TranslatedMessage id="network.title" />
            </h1>
          </div>
        </div>

        <hr />

        <div className="row mt-5">
          <div className="col-md">
            <h2 className="mb-0 text-muted">
              <TranslatedMessage
                id="network.reps_online"
                values={{
                  count: (
                    <span className="text-body">
                      <FormattedNumber
                        value={keys(representativesOnline).length}
                      />
                    </span>
                  )
                }}
              />
            </h2>
            <p className="text-muted">
              <TranslatedMessage id="network.reps_online_desc" />
            </p>

            <h5 className="mb-0 text-muted">
              <TranslatedMessage
                id="network.online_voting_power"
                values={{
                  count: (
                    <span className="text-body">
                      {this.amountRepresented()}
                    </span>
                  )
                }}
              />
            </h5>
            <p className="text-muted">
              <TranslatedMessage
                id="network.total_voting_power"
                values={{
                  percent: (
                    <span className="text-body">
                      {this.percentRepresented()}
                    </span>
                  )
                }}
              />
            </p>

            <h5 className="mb-0 text-muted">
              <TranslatedMessage
                id="network.official_reps"
                values={{
                  count: (
                    <span className="text-body">
                      {this.officialRepresented()}
                    </span>
                  )
                }}
              />
            </h5>
            <p className="text-muted">
              <TranslatedMessage
                id="network.official_reps_stat"
                values={{
                  totalPower: (
                    <span className="text-body">{this.officialPercent()}</span>
                  ),
                  onlinePower: (
                    <span className="text-body">
                      {this.officialOnlinePercent()}
                    </span>
                  )
                }}
              />
            </p>
          </div>
          <div className="col-md">
            <h2 className="mb-0 text-muted">
              <TranslatedMessage
                id="network.online_rebroadcasting"
                values={{
                  count: (
                    <span className="text-body">
                      <FormattedNumber
                        value={keys(this.rebroadcastableReps()).length}
                        maximumFractionDigits={0}
                      />
                    </span>
                  )
                }}
              />
            </h2>
            <p className="text-muted">
              <TranslatedMessage
                id="network.online_rebroadcasting_desc"
                values={{
                  currencyShortName: config.currency.shortName,
                  amount: (
                    <FormattedNumber
                      value={this.rebroadcastThreshold()}
                      maximumFractionDigits={0}
                    />
                  )
                }}
              />
            </p>

            <h5 className="mb-0 text-muted">
              <TranslatedMessage
                id="network.rebroadcast_amt"
                values={{
                  count: (
                    <span className="text-body">
                      <FormattedNumber
                        value={this.onlineRebroadcastWeight()}
                        maximumFractionDigits={0}
                      />{" "}
                      {config.currency.shortName}
                    </span>
                  )
                }}
              />
            </h5>
            <p className="mb-0 text-muted">
              <TranslatedMessage
                id="network.rebroadcast_stat"
                values={{
                  totalPower: (
                    <span className="text-body">
                      {this.rebroadcastPercent()}
                    </span>
                  ),
                  onlinePower: (
                    <span className="text-body">
                      {this.onlineRebroadcastPercent()}
                    </span>
                  )
                }}
              />
            </p>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md">
            <NetworkThroughput />
            <NetworkDifficulty />
          </div>
          <div className="col-md mt-3 mt-md-0">
            <PeerVersions />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-6">
            <NetworkConfirmationQuorum />
          </div>
          <div className="col-md-6">
            <NetworkConfirmationHistory />
          </div>
        </div>

        <AggregateNetworkData />
      </div>
    );
  }
}

export default withNetworkData(NetworkStatus);
