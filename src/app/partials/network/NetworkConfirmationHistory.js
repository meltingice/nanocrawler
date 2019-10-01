import React from "react";
import { CSSTransitionGroup } from "react-transition-group";
import BlockLink from "../BlockLink";
import { apiClient } from "lib/Client";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";
import { formatTimestamp } from "lib/util";

export default class NetworkConfirmationHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avgCount: null,
      avgDuration: null,
      confirmations: []
    };

    this.timer = null;
  }

  componentDidMount() {
    this.pollForUpdates();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  async pollForUpdates() {
    const resp = await apiClient.confirmationHistory(3);
    this.setState(
      {
        avgCount: parseInt(resp.confirmation_stats.count, 10),
        avgDuration: parseInt(resp.confirmation_stats.average, 10),
        confirmations: resp.confirmations
      },
      () => {
        this.timer = setTimeout(this.pollForUpdates.bind(this), 10000);
      }
    );
  }

  get durationInSeconds() {
    const { avgDuration } = this.state;
    return Math.round((avgDuration * 100) / 1000.0) / 100;
  }

  render() {
    const { avgCount, avgDuration, confirmations } = this.state;

    return (
      <div>
        <h2 className="mb-0">
          <TranslatedMessage id="network.confirmation_history.title" />
        </h2>
        <p className="text-muted">
          <TranslatedMessage id="network.confirmation_history.desc" />
        </p>

        {avgCount === null ? (
          <EmptyState />
        ) : (
          <div>
            <h5 className="mb-0">
              <TranslatedMessage
                id="network.confirmation_history.confirmation_time"
                values={{
                  time: <FormattedNumber value={this.durationInSeconds} />
                }}
              />{" "}
              <span className="text-muted">
                <TranslatedMessage id="network.confirmation_history.avg_confirmation_time" />
              </span>
            </h5>
            <p className="text-muted">
              <TranslatedMessage
                id="network.confirmation_history.sample_size"
                values={{ count: avgCount }}
              />
            </p>

            <h5>
              <TranslatedMessage id="network.confirmation_history.recent_elections" />
            </h5>
            <CSSTransitionGroup
              transitionName="Transaction"
              transitionEnterTimeout={500}
              transitionLeave={false}
            >
              {confirmations.slice(0, 3).map(confirmation => (
                <RecentConfirmation
                  key={confirmation.hash}
                  confirmation={confirmation}
                />
              ))}
            </CSSTransitionGroup>
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

const RecentConfirmation = ({ confirmation }) => (
  <div>
    <p className="text-monospace mb-0">
      <BlockLink hash={confirmation.hash} className="break-word text-dark" />
    </p>
    <p className="text-muted">
      <TranslatedMessage
        id="network.confirmation_history.confirmation_time"
        values={{
          time: Math.round((confirmation.duration * 100) / 1000.0) / 100
        }}
      />{" "}
      - {formatTimestamp(confirmation.time)}
    </p>
  </div>
);
