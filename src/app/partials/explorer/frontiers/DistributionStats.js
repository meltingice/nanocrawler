import React from "react";
import { FormattedNumber } from "react-intl";

export default function DistributionStats({ distribution }) {
  return (
    <div className="row mt-3">
      <DistributionRange range="1 - 10" value={distribution["10"]} />
      <DistributionRange range="10 - 100" value={distribution["100"]} />
      <DistributionRange range="100 - 1k" value={distribution["1000"]} />
      <DistributionRange range="1k - 10k" value={distribution["10000"]} />
      <DistributionRange range="10k - 100k" value={distribution["100000"]} />
      <DistributionRange range="100k - 1M" value={distribution["1000000"]} />
      <DistributionRange range="1M - 10M" value={distribution["10000000"]} />
      <DistributionRange range="10M - 100M" value={distribution["100000000"]} />
    </div>
  );
}

const DistributionRange = ({ range, value }) => (
  <div className="col-md col-6 text-center mb-1">
    <p className="text-muted mb-1">{range} NANO</p>
    <h4>
      <FormattedNumber value={value || 0} />
    </h4>
  </div>
);
