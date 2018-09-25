import React from "react";
import ReactResizeDetector from "react-resize-detector";
import _ from "lodash";
import { Bar } from "@nivo/bar";

/*
 data = [
  {
    range: "0 - 1",
    value: 123493
  }
 ]
*/

export default function DistributionGraph({ distribution }) {
  if (!distribution) return null;

  return (
    <ReactResizeDetector handleWidth>
      {width => (
        <Bar
          data={graphData(distribution)}
          indexBy="range"
          width={width}
          height={500}
          layout={width < 768 ? "horizontal" : "vertical"}
          margin={{
            top: 50,
            right: 50,
            bottom: 50,
            left: 120
          }}
          padding={0.3}
          colors="paired"
          colorBy="id"
          borderColor="inherit:darker(1.6)"
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Balance (NANO)",
            legendPosition: "middle",
            legendOffset: 36
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "No. of Accounts",
            legendPosition: "middle",
            legendOffset: -80
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="inherit:darker(1.6)"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      )}
    </ReactResizeDetector>
  );
}

const graphData = distribution => {
  const nameSub = {
    1000: "1k",
    10000: "10k",
    100000: "100k",
    1000000: "1M",
    10000000: "10M",
    100000000: "100M"
  };

  const shortName = value => nameSub[value] || value;

  let lowerLimit = 0;

  return _.map(distribution, (value, upperLimit) => {
    const range = `${shortName(lowerLimit)} - ${shortName(upperLimit)}`;
    lowerLimit = upperLimit;
    return { range, value };
  });
};
