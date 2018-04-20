import React from "react";

import HistorySendBlock from "./history/HistorySendBlock";
import HistoryReceiveBlock from "./history/HistoryReceiveBlock";
import HistoryStateBlock from "./history/HistoryStateBlock";

export default function TransactionHistory({ history }) {
  const blocks = history.map(block => {
    switch (block.type) {
      case "send":
        return <HistorySendBlock key={block.hash} block={block} />;
      case "receive":
        return <HistoryReceiveBlock key={block.hash} block={block} />;
      case "state":
        return <HistoryStateBlock key={block.hash} block={block} />;
      default:
        return null;
    }
  });

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Account</th>
            <th>Amount</th>
            <th>Block</th>
          </tr>
        </thead>
        <tbody>{blocks}</tbody>
      </table>
    </div>
  );
}
