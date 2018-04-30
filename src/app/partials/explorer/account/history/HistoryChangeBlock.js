import React from "react";
import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";

export default function HistoryChangeBlock({ block }) {
  return (
    <tr>
      <td className="text-info">Change</td>
      <td>
        <AccountLink
          account={block.representative}
          ninja
          className="text-dark"
        />
      </td>
      <td>
        <i className="text-muted">N/A</i>
      </td>
      <td>
        <BlockLink hash={block.hash} short className="text-muted" />
      </td>
    </tr>
  );
}
