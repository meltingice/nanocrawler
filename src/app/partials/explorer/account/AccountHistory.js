import React, { Fragment, memo } from "react";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";
import TransactionHistory from "./TransactionHistory";
import UnopenedAccount from "./UnopenedAccount";

import config from "client-config.json";
import { apiClient } from "lib/Client";

import AccountWebsocket from "lib/AccountWebsocket";

export default function AccountHistory({
  unopened,
  history,
  pendingTransactions,
  blockCount,
  loadMore,
  hasMore
}) {
  return (
    <Fragment>
      <PendingTransactions pendingTransactions={pendingTransactions} />
      <ReceivedTransactions history={history} blockCount={blockCount} />
      {unopened && <UnopenedAccount />}
      <LoadMore loadMore={loadMore} hasMore={hasMore} />
    </Fragment>
  );
}

const PendingTransactions = ({ pendingTransactions }) => {
  if (!pendingTransactions || pendingTransactions.total === 0) return null;

  return (
    <Fragment>
      <div className="row mt-5 align-items-center">
        <div className="col">
          <h2 className="mb-0">
            <TranslatedMessage id="account.pending.title" />
          </h2>
          <p className="text-muted">
            <TranslatedMessage id="account.pending.limit" />
          </p>
        </div>
        <div className="col-auto">
          <h4>
            <FormattedNumber value={pendingTransactions.total} />{" "}
            <span className="text-muted">
              <TranslatedMessage id="account.pending.count" />
            </span>
          </h4>
        </div>
      </div>

      <TransactionHistory history={pendingTransactions.blocks} />
    </Fragment>
  );
};

const ReceivedTransactions = ({ history, blockCount }) => {
  if (history.length === 0) return null;

  return (
    <Fragment>
      <div className="row mt-5 mb-2 align-items-center">
        <div className="col">
          <h2>
            <TranslatedMessage id="account.transactions.title" />
          </h2>
        </div>
        <div className="col-auto">
          <h4>
            <FormattedNumber value={blockCount} />{" "}
            <span className="text-muted">
              <TranslatedMessage id="account.transactions.total" />
            </span>
          </h4>
        </div>
      </div>

      <TransactionHistory history={history} />
    </Fragment>
  );
};

const LoadMore = memo(({ hasMore, loadMore }) => {
  if (!hasMore) return null;

  return (
    <div className="text-center">
      <button className="btn btn-nano-primary" onClick={loadMore}>
        <TranslatedMessage id="account.transactions.load_more" />
      </button>
    </div>
  );
});
