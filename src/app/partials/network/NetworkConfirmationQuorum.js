import React from "react";
import { FormattedNumber } from "react-intl";
import { apiClient } from "lib/Client";

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
      this.timer = setTimeout(this.fetchData.bind(this), 10000);
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
      <div className="mt-3">
        <h2 className="mb-0">Network Quorum</h2>
        <p className="text-muted">
          Important information regarding the current network voting state
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
              <FormattedNumber value={peers_stake_total_mnano} /> NANO{" "}
              <span
                className={
                  this.stakeBelowMinumum() ? "text-danger" : "text-muted"
                }
              >
                peers total weight
              </span>
            </h5>
            {!this.stakeBelowMinumum() && (
              <p
                className={
                  this.stakeBelowMinumum() ? "text-danger mb-0" : "text-muted"
                }
              >
                The total voting weight of the peers you are directly connected
                to
              </p>
            )}

            {this.stakeBelowMinumum() && (
              <p className="text-danger">
                The voting weight of your peers is below the currently
                configured minimum required quorum. Blocks will not confirm
                until it rises above{" "}
                <FormattedNumber value={online_weight_minimum_mnano} /> NANO.
              </p>
            )}

            <h5 className="mb-0">
              <FormattedNumber value={quorum_delta_mnano} /> NANO{" "}
              <span className="text-muted">quorum delta</span>
            </h5>
            <p className="text-muted">
              The vote tally required to confirm blocks and rollback a block in
              the event of a fork
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
