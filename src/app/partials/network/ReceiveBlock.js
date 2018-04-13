import React from "react";
import accounting from "accounting";

export default function ReceiveBlock({ count }) {
  return (
    <h3>
      {accounting.formatNumber(count)}{" "}
      <small className="text-muted">transactions received</small>
    </h3>
  );
}
