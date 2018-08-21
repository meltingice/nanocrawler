import React from "react";
import accounting from "accounting";
import injectClient from "../../../lib/ClientComponent";

import "./TpsCounter.css";

class TpsCounter extends React.PureComponent {
  state = {
    value: 0.0,
    dir: "up"
  };

  timer = null;

  componentDidMount() {
    this.fetch();
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  async fetch() {
    const tps = await this.props.client.networkTps(this.props.period);
    this.setState(
      {
        value: tps,
        dir: tps > this.state.value ? "up" : "down"
      },
      () => {
        this.timer = setTimeout(this.fetch.bind(this), 10000);
      }
    );
  }

  get intensity() {
    const { value } = this.state;

    if (value < 1) return 0;
    if (value < 5) return 1;
    if (value < 20) return 2;
    if (value < 50) return 3;
    if (value < 100) return 4;
    return 5;
  }

  render() {
    const { value } = this.state;

    return (
      <h3 className="mb-0">
        <span className={`tps-counter intensity-${this.intensity}`}>
          {accounting.formatNumber(value, 3)}
        </span>{" "}
        <small className="text-muted">{this.props.title}</small>
      </h3>
    );
  }
}

export default injectClient(TpsCounter);
