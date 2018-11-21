import React from "react";
import ReactResizeDetector from "react-resize-detector";
import toPairs from "lodash/toPairs";
import { Bar } from "@nivo/bar";
import config from "client-config.json";

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
          width={width || 0}
          height={width < 768 ? 350 : 500}
          layout="vertical"
          margin={{
            top: 50,
            right: 30,
            bottom: width < 768 ? 80 : 50,
            left: 80
          }}
          padding={0.3}
          colors="paired"
          colorBy="id"
          borderColor="inherit:darker(1.6)"
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: width < 768 ? 45 : 0,
            legend: `Balance (${config.currency.shortName})`,
            legendPosition: "middle",
            legendOffset: width < 768 ? 60 : 36
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "No. of Accounts",
            legendPosition: "middle",
            legendOffset: -70
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

  let lowerLimit = 1;

  return toPairs(distribution)
    .filter(d => d[0] > 1)
    .sort((a, b) => parseFloat(a[0], 10) > parseFloat(b[0], 10))
    .map(d => {
      const [upperLimit, value] = d;
      const range = `${shortName(lowerLimit)} - ${shortName(upperLimit)}`;
      lowerLimit = upperLimit;
      return { range, value };
    });
};
