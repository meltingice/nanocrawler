import React from "react";
import accounting from "accounting";

export default function SendBlock({ count }) {
  return (
    <h3>
      {accounting.formatNumber(count)}{" "}
      <small className="text-muted">send blocks</small>
    </h3>
  );
}
