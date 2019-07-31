import React from "react";
import { FormattedNumber } from "react-intl";
import { apiClient } from "lib/Client";
import { TranslatedMessage } from "lib/TranslatedMessage";
import config from "client-config.json";

export default class NetworkConfirmationQuorum extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.timer = null;
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  async fetchData() {
    const quorum = await apiClient.confirmationQuorum();
    this.setState(quorum, () => {
      this.timer = setTimeout(this.fetchData.bind(this), 30000);
    });
  }

  stakeBelowMinumum() {
    const { peers_stake_total_mnano, online_weight_minimum_mnano } = this.state;

    return (
      parseFloat(peers_stake_total_mnano, 10) <
      parseFloat(online_weight_minimum_mnano, 10)
    );
  }

  render() {
    const {
      quorum_delta_mnano,
      peers_stake_total_mnano,
      online_weight_minimum_mnano
    } = this.state;

    return (
      <div>
        <h2 className="mb-0">
          <TranslatedMessage id="network.quorum.title" />
        </h2>
        <p className="text-muted">
          <TranslatedMessage id="network.quorum.desc" />
        </p>

        {quorum_delta_mnano === null ? (
          <EmptyState />
        ) : (
          <div>
            <h5
              className={`mb-0 ${
                this.stakeBelowMinumum() ? "text-danger" : ""
              }`}
            >
              <FormattedNumber value={peers_stake_total_mnano || 0} />{" "}
              {config.currency.shortName}{" "}
              <span
                className={
                  this.stakeBelowMinumum() ? "text-danger" : "text-muted"
                }
              >
                <TranslatedMessage id="network.quorum.peers_total_weight" />
              </span>
            </h5>
            {!this.stakeBelowMinumum() && (
              <p
                className={
                  this.stakeBelowMinumum() ? "text-danger mb-0" : "text-muted"
                }
              >
                <TranslatedMessage id="network.quorum.peers_total_weight_desc" />
              </p>
            )}

            {this.stakeBelowMinumum() && (
              <p className="text-danger">
                <TranslatedMessage
                  id="network.quorum.peers_total_weight_danger"
                  values={{
                    currencyShortName: config.currency.shortName,
                    weight: (
                      <FormattedNumber
                        value={online_weight_minimum_mnano || 0}
                      />
                    )
                  }}
                />
              </p>
            )}

            <h5 className="mb-0">
              <FormattedNumber value={quorum_delta_mnano || 0} />{" "}
              {config.currency.shortName}{" "}
              <span className="text-muted">
                <TranslatedMessage id="network.quorum.delta" />
              </span>
            </h5>
            <p className="text-muted">
              <TranslatedMessage id="network.quorum.delta_desc" />
            </p>
          </div>
        )}
      </div>
    );
  }
}

const EmptyState = () => (
  <div className="text-center">
    <h5 className="text-muted">Loading...</h5>
  </div>
);
