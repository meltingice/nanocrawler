import React from "react";
import accounting from "accounting";

import AccountLink from "../AccountLink";
import BlockLink from "../BlockLink";
import { keyToPublicAccountId } from "../../../lib/util";

export default function HistoryStateBlock({ block }) {
  let account, amount;
  switch (block.subtype) {
    case "send":
    case "receive":
    case "open":
      account = keyToPublicAccountId(block.link);
      amount = block.amount;
      break;

    case "change":
      account = block.representative;
      amount = 0;
      break;
  }

  return (
    <tr>
      <td>
        State <span className="text-muted">{block.subtype}</span>
      </td>
      <td>
        <AccountLink account={account} />
      </td>
      <td>{accounting.formatNumber(amount, 6)} NANO</td>
      <td>
        <BlockLink hash={block.hash} short />
      </td>
    </tr>
  );
}
