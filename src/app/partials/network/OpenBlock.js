import React from "react";
import accounting from "accounting";

export default function OpenBlock({ count }) {
  return (
    <h3>
      {accounting.formatNumber(count)}{" "}
      <small className="text-muted">open blocks</small>
    </h3>
  );
}
