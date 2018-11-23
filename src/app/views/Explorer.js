import React from "react";
import { Helmet } from "react-helmet";
import { withRouter, Link } from "react-router-dom";
import { TranslatedMessage } from "lib/TranslatedMessage";
import config from "client-config.json";

import ValidatedSearch from "app/partials/ValidatedSearch";
import KnownAccounts from "app/partials/explorer/KnownAccounts";
import ExplorerTopAccounts from "app/partials/explorer/ExplorerTopAccounts";
import RecentBlockStream from "app/partials/explorer/RecentBlockStream";
import SupplyStats from "app/partials/explorer/SupplyStats";
import AccountLink from "app/partials/AccountLink";

class Explorer extends React.PureComponent {
  state = {
    search: "",
    type: null,
    valid: false
  };

  handleSubmit(e) {
    e.preventDefault();
    const { history } = this.props;
    const { search, type, valid } = this.state;

    if (!valid) return;

    if (type === "account") {
      history.push(`/explorer/account/${search}`);
    } else if (type === "block") {
      history.push(`/explorer/block/${search}`);
    }
  }

  render() {
    const { search } = this.state;

    return (
      <div className="row justify-content-center my-5 mx-0">
        <Helmet title="Network Explorer" />

        <div className="col col-md-8">
          <h1>
            <TranslatedMessage id="explorer.title" />
          </h1>

          <hr />

          <form className="my-5" onSubmit={this.handleSubmit.bind(this)}>
            <label>
              <TranslatedMessage
                id="explorer.form.help"
                values={{ currency: config.currency.name }}
              />
            </label>

            <div className="form-row">
              <div className="col-md">
                <ValidatedSearch
                  size="lg"
                  onChange={({ search, type, valid }) =>
                    this.setState({ search, type, valid })
                  }
                />
                <p className="mt-1">
                  <Link className="text-muted" to="/explorer/exchange_rates">
                    Exchange Rates
                  </Link>
                </p>
              </div>
              <div className="col-auto mt-2 mt-md-0">
                <button className="btn btn-nano-primary btn-lg">
                  <TranslatedMessage id="search" />
                </button>
              </div>
            </div>
          </form>

          <SupplyStats />

          <h3 className="mt-5 mb-0">
            <TranslatedMessage id="explorer.known_accounts" />
          </h3>
          <p className="text-muted">
            <TranslatedMessage id="explorer.known_accounts.desc" />
          </p>

          <hr />

          {KnownAccounts.map(account => (
            <KnownAccount key={account.account} account={account} />
          ))}

          <div className="mt-5">
            <ExplorerTopAccounts count={5} />
          </div>

          <div className="mt-5">
            <RecentBlockStream count={10} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Explorer);

const KnownAccount = ({ account }) => {
  return (
    <div className="row">
      <div className="col">
        <h5 className="mb-0">
          <AccountLink
            account={account.account}
            name={account.alias}
            className="text-dark break-word"
          />
        </h5>
        <p>
          <AccountLink
            account={account.account}
            className="text-muted break-word"
          />
        </p>
      </div>
    </div>
  );
};
