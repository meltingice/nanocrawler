import React from "react";
import injectClient from "../../lib/ClientComponent";
import Statistics from "../../lib/Statistics";
import NetworkChart from "./charts/NetworkChart";

class NodeStatistics extends React.Component {
  constructor(props) {
    super(props);

    this.statistics = new Statistics(this.props.client);
    this.timeout = null;

    this.state = {};
  }

  componentWillMount() {
    this.updateStats();
  }

  async updateStats() {
    await this.statistics.fetch();
    this.forceUpdate();

    this.timeout = setTimeout(this.updateStats.bind(this), 1000);
  }

  render() {
    return (
      <div className="row">
        <div className="col-md">
          <h3>Traffic</h3>
          <NetworkChart
            in={this.statistics.getTimeSeries("traffic.all.in")}
            out={this.statistics.getTimeSeries("traffic.all.out")}
          />
        </div>

        <div className="col-md" />
      </div>
    );
  }
}

export default injectClient(NodeStatistics);
