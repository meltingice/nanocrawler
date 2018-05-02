import React from "react";
import injectClient from "../../lib/ClientComponent";
import Statistics from "../../lib/Statistics";
import ResponsiveChart from "./charts/ResponsiveChart";
import { AreaChart, Legend } from "react-easy-chart";

class NodeStatistics extends React.Component {
  constructor(props) {
    super(props);

    this.statistics = new Statistics(this.props.client);
    this.timeout = null;

    this.state = {
      data: {}
    };
  }

  componentWillMount() {
    this.updateStats();
  }

  async updateStats() {
    await this.statistics.fetch();
    this.setState({
      data: this.statistics.data
    });

    this.timeout = setTimeout(this.updateStats.bind(this), 5000);
  }

  chartData(key) {
    const { data } = this.state;
    if (data[key]) return data[key].toArray();
    return [];
  }

  render() {
    return (
      <div className="row">
        <div className="col">
          <ResponsiveChart>
            {width => (
              <AreaChart
                xType="time"
                datePattern="%H:%M:%S"
                axes
                axisLabels={{ x: "Time", y: "Bytes" }}
                interpolate={"cardinal"}
                width={width}
                height={width * 9 / 16}
                data={[
                  this.chartData("traffic.all.in") || [],
                  this.chartData("traffic.all.out") || []
                ]}
              />
            )}
          </ResponsiveChart>
          <Legend
            data={[{ key: "Traffic In" }, { key: "Traffic Out" }]}
            dataId="key"
            horizontal
          />
        </div>
      </div>
    );
  }
}

export default injectClient(NodeStatistics);
