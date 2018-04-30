import React from "react";
import accounting from "accounting";

import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";

export default function HistorySendBlock({ block }) {
  return (
    <tr>
      <td className="text-danger">Send</td>
      <td>
        <span className="text-muted">to</span>{" "}
        <AccountLink account={block.account} className="text-dark" />
      </td>
      <td className="text-danger">
        -{accounting.formatNumber(block.amount, 6)} NANO
      </td>
      <td>
        <BlockLink hash={block.hash} short className="text-muted" />
      </td>
    </tr>
  );
}
