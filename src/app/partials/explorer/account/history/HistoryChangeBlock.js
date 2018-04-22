import React from "react";
import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";

export default function HistoryChangeBlock({ block }) {
  return (
    <tr>
      <td>Change</td>
      <td>
        <AccountLink account={block.representative} ninja />
      </td>
      <td>
        <i className="text-muted">N/A</i>
      </td>
      <td>
        <BlockLink hash={block.hash} short />
      </td>
    </tr>
  );
}
