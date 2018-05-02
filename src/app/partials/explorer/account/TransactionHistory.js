import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import HistorySendBlock from "./history/HistorySendBlock";
import HistoryReceiveBlock from "./history/HistoryReceiveBlock";
import HistoryOpenBlock from "./history/HistoryOpenBlock";
import HistoryChangeBlock from "./history/HistoryChangeBlock";
import HistoryStateBlock from "./history/HistoryStateBlock";

export default function TransactionHistory({ history }) {
  const blocks = history.map(block => {
    switch (block.type) {
      case "send":
        return <HistorySendBlock key={block.hash} block={block} />;
      case "receive":
      case "pending":
        return <HistoryReceiveBlock key={block.hash} block={block} />;
      case "open":
        return <HistoryOpenBlock key={block.hash} block={block} />;
      case "change":
        return <HistoryChangeBlock key={block.hash} block={block} />;
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
            <th>Date</th>
            <th>Block</th>
          </tr>
        </thead>

        <ReactCSSTransitionGroup
          component="tbody"
          transitionName="Transaction"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {blocks}
        </ReactCSSTransitionGroup>
      </table>
    </div>
  );
}
