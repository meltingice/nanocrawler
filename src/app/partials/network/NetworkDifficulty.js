import React from "react";
import { FormattedNumber } from "react-intl";
import { apiClient } from "lib/Client";

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
      <div className="network-difficulty">
        <h2 className="mb-0">Network Difficulty</h2>
        <p className="text-muted">
          The current active difficulty on the network, which can be used to
          prioritize transactions.
        </p>

        <h3 className={`intensity-${this.multiplierIntensity}`}>
          <i className={`fa fa-arrow-${this.multiplierTrend}`} />{" "}
          <FormattedNumber value={multiplier} maximumFractionDigits={3} />x{" "}
          <small className="text-muted">difficulty multiplier</small>
        </h3>

        <div className="row">
          <div className="col-sm">
            <h5 className="mb-0 text-muted">Minimum Difficulty</h5>
            <p>0x{network_minimum}</p>
          </div>
          <div className="col-sm">
            <h5 className="mb-0 text-muted">Current Difficulty</h5>
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
