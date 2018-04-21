import React from "react";
import accounting from "accounting";

import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";

export default function HistorySendBlock({ block }) {
  return (
    <tr>
      <td>Send</td>
      <td>
        <AccountLink account={block.account} />
      </td>
      <td>{accounting.formatNumber(block.amount, 6)} NANO</td>
      <td>
        <BlockLink hash={block.hash} short />
      </td>
    </tr>
  );
}
