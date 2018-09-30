import React, { Fragment } from "react";
import AccountLink from "app/partials/AccountLink";
import PriceWithConversions from "app/partials/PriceWithConversions";

const Account = ({ account }) => {
  return (
    <div className="row align-items-center">
      <div className="col-md-9 mb-2 mb-lg-0">
        <p className="mb-0">
          <AccountLink
            account={account.account}
            ninja
            className="text-dark break-word"
          />
        </p>
      </div>
      <div className="col text-left text-md-right">
        <PriceWithConversions
          amount={account.balance}
          currencies={["nano", "btc", "usd"]}
        >
          {(nano, btc, usd) => (
            <Fragment>
              <h5 className="mb-0">{nano}</h5>
              <p className="text-muted mb-0">
                {btc} / {usd}
              </p>
            </Fragment>
          )}
        </PriceWithConversions>
      </div>
    </div>
  );
};

export default function AccountList({ page, accounts, setPage }) {
  return (
    <div className="row">
      <div className="col">
        {accounts.map(account => (
          <Fragment key={account.account}>
            <Account account={account} />
            <hr />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
