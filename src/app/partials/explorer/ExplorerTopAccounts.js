import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import AccountLink from "app/partials/AccountLink";
import PriceWithConversions from "app/partials/PriceWithConversions";
import { apiClient } from "lib/Client";
import { TranslatedMessage } from "lib/TranslatedMessage";

const Account = ({ account, balance, rank }) => {
  return (
    <Fragment>
      <div className="row">
        <div className="col">
          <div className="row">
            <div className="col-auto pr-0">
              <h4>#{rank}</h4>
            </div>
            <div className="col">
              <p className="mb-1">
                <AccountLink
                  account={account}
                  ninja
                  className="text-muted break-word"
                />
              </p>

              <PriceWithConversions
                amount={balance}
                currencies={["base", "btc", "usd"]}
              >
                {(base, btc, usd) => (
                  <h6 className="mb-0">
                    {base} / {btc} / {usd}
                  </h6>
                )}
              </PriceWithConversions>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </Fragment>
  );
};

export default class ExplorerTopAccounts extends React.Component {
  state = {
    accounts: []
  };

  async componentDidMount() {
    const { accounts } = await apiClient.frontierList(1);
    this.setState({
      accounts: accounts.slice(0, this.props.count)
    });
  }

  render() {
    const { count } = this.props;

    return (
      <Fragment>
        <div className="row align-items-center">
          <div className="col-md">
            <h3 className="mb-0">
              <TranslatedMessage
                id="explorer.top_accounts"
                values={{ count }}
              />
            </h3>
            <p className="mb-0 text-muted">
              <TranslatedMessage id="explorer.top_accounts_desc" />
            </p>
          </div>
          <div className="col-auto mt-2 mt-md-0">
            <Link
              to="/explorer/accounts/1"
              className="btn btn-sm btn-nano-primary"
            >
              <TranslatedMessage id="explorer.top_accounts_link" />
            </Link>
          </div>
        </div>

        <hr />

        {this.state.accounts.map((account, i) => (
          <Account key={account.account} rank={i + 1} {...account} />
        ))}
      </Fragment>
    );
  }
}
