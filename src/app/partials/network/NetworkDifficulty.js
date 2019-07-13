import React from "react";
import { FormattedNumber } from "react-intl";
import { apiClient } from "lib/Client";
import { TranslatedMessage } from "lib/TranslatedMessage";

import "./NetworkDifficuty.css";

export default class NetworkDifficult extends React.Component {
  state = { lastMultiplier: 0 };
  timer = null;

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  async fetchData() {
    const data = await apiClient.activeDifficulty();
    this.setState(data, () => {
      this.timer = setTimeout(this.fetchData.bind(this), 10000);
    });
  }

  get multiplierIntensity() {
    const { multiplier } = this.state;

    if (multiplier < 2) return 0;
    if (multiplier < 4) return 1;
    if (multiplier < 6) return 2;
    if (multiplier < 10) return 3;
    if (multiplier < 20) return 4;
    return 5;
  }

  get multiplierTrend() {
    const { difficulty_trend, multiplier } = this.state;
    if (difficulty_trend[0] < multiplier) return "down";
    return "up";
  }

  render() {
    const { network_minimum, network_current, multiplier } = this.state;
    if (!network_minimum) return <EmptyState />;

    return (
      <div className="mt-3 network-difficulty">
        <h2 className="mb-0">
          <TranslatedMessage id="network.difficulty.title" />
        </h2>
        <p className="text-muted">
          <TranslatedMessage id="network.difficulty.desc" />
        </p>

        <h3 className={`intensity-${this.multiplierIntensity}`}>
          <i className={`fa fa-arrow-${this.multiplierTrend}`} />{" "}
          <FormattedNumber value={multiplier} maximumFractionDigits={3} />x{" "}
          <small className="text-muted">
            <TranslatedMessage id="network.difficulty.multiplier" />
          </small>
        </h3>

        <div className="row">
          <div className="col-sm">
            <h5 className="mb-0 text-muted">
              <TranslatedMessage id="network.difficulty.minimum_difficulty" />
            </h5>
            <p>0x{network_minimum}</p>
          </div>
          <div className="col-sm">
            <h5 className="mb-0 text-muted">
              <TranslatedMessage id="network.difficulty.current_difficulty" />
            </h5>
            <p>0x{network_current}</p>
          </div>
        </div>
      </div>
    );
  }
}

const EmptyState = () => (
  <div className="text-center">
    <h5 className="text-muted">Loading...</h5>
  </div>
);
