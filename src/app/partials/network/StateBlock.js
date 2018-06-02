import React from "react";
import accounting from "accounting";

export default function StateBlock({ count }) {
  return (
    <h3>
      {accounting.formatNumber(count)}{" "}
      <small className="text-muted">state blocks</small>
    </h3>
  );
}
