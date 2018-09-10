import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { FormattedMessage } from "react-intl";

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
            <th className="text-capitalize">
              <FormattedMessage id="type" />
            </th>
            <th className="text-capitalize">
              <FormattedMessage id="account" />
            </th>
            <th className="text-capitalize">
              <FormattedMessage id="amount" />
            </th>
            <th className="text-capitalize">
              <FormattedMessage id="date" />
            </th>
            <th className="text-capitalize">
              <FormattedMessage id="block" />
            </th>
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
