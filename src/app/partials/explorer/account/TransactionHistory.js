import React, { Fragment } from "react";
import { CSSTransitionGroup } from "react-transition-group";
import { TranslatedMessage } from "lib/TranslatedMessage";

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
    <Fragment>
      <div className="row d-none d-lg-flex">
        <div className="col-1">
          <h6 className="text-capitalize mb-0">
            <TranslatedMessage id="type" />
          </h6>
        </div>
        <div className="col-7">
          <h6 className="text-capitalize mb-0">
            <TranslatedMessage id="account" /> /{" "}
            <TranslatedMessage id="block" />
          </h6>
        </div>
        <div className="col">
          <h6 className="text-capitalize mb-0">
            <TranslatedMessage id="amount" />
          </h6>
        </div>
        <div className="col text-right">
          <h6 className="text-capitalize mb-0">
            <TranslatedMessage id="date" />
          </h6>
        </div>
      </div>

      <hr />

      <CSSTransitionGroup
        transitionName="Transaction"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {blocks}
      </CSSTransitionGroup>
    </Fragment>
  );
}
