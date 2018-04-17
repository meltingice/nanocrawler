import React from "react";
import _ from "lodash";
import { TimeSeries } from "pondjs";
import {
  Resizable,
  ChartContainer,
  ChartRow,
  Charts,
  AreaChart,
  YAxis,
  styler
} from "react-timeseries-charts";

export default class NetworkChart extends React.Component {
  render() {
    if (this.props.in.size() === 0 || this.props.out.size() === 0) return null;

    const upDownStyle = styler([
      { key: "in", color: "#C8D5B8" },
      { key: "out", color: "#9BB8D7" }
    ]);

    const trafficSeries = TimeSeries.timeSeriesListMerge({
      name: "traffic",
      seriesList: [this.props.in, this.props.out]
    });

    const max = _.max([this.props.in.max("in"), this.props.out.max("out")]);

    return (
      <Resizable>
        <ChartContainer
          timeRange={trafficSeries.range()}
          maxTime={trafficSeries.range().end()}
          minTime={trafficSeries.range().begin()}
          minDuration={1000 * 60 * 60}
        >
          <ChartRow height="250" debug={false}>
            <Charts>
              <AreaChart
                axis="traffic"
                series={trafficSeries}
                columns={{
                  up: ["in"],
                  down: ["out"]
                }}
                style={upDownStyle}
              />
            </Charts>

            <YAxis
              id="traffic"
              label="Traffic (bps)"
              labelOffset={0}
              min={-max}
              max={max}
              absolute={true}
              width="60"
              type="linear"
            />
          </ChartRow>
        </ChartContainer>
      </Resizable>
    );
  }
}
