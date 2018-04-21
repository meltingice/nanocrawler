import React from "react";
import accounting from "accounting";

import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";

export default function HistoryReceiveBlock({ block }) {
  return (
    <tr>
      <td>Receive</td>
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
