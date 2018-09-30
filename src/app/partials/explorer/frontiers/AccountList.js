import React, { Fragment } from "react";
import { FormattedNumber } from "react-intl";
import AccountLink from "app/partials/AccountLink";
import PriceWithConversions from "app/partials/PriceWithConversions";

const Account = ({ account, rank }) => {
  return (
    <div className="row align-items-center">
      <div className="col-md-8 mb-2 mb-lg-0">
        <div className="row">
          <div className="col-auto">
            <h4>
              #<FormattedNumber value={rank} />
            </h4>
          </div>
          <div className="col-lg">
            <p className="mb-0">
              <AccountLink
                account={account.account}
                ninja
                className="text-dark break-word"
              />
            </p>
          </div>
        </div>
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

export default function AccountList({ perPage, page, accounts, setPage }) {
  return (
    <div className="row">
      <div className="col">
        {accounts.map((account, i) => (
          <Fragment key={account.account}>
            <Account account={account} rank={perPage * (page - 1) + i + 1} />
            <hr />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
