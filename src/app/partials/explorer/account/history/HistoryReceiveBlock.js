import React from "react";
import accounting from "accounting";

import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";

export default function HistoryReceiveBlock({ block }) {
  return (
    <tr>
      <td className="text-success">Receive</td>
      <td>
        <AccountLink account={block.account} className="text-dark" />
      </td>
      <td className="text-success">
        +{accounting.formatNumber(block.amount, 6)} NANO
      </td>
      <td>
        <BlockLink hash={block.hash} short className="text-muted" />
      </td>
    </tr>
  );
}
