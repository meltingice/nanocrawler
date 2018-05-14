import React, { Fragment } from "react";
import _ from "lodash";
import accounting from "accounting";
import injectClient from "../../../lib/ClientComponent";

import AccountLink from "../../partials/AccountLink";
import PriceWithConversions from "../../partials/PriceWithConversions";

class RichList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: [],
      officialRepresentatives: {},
      representativesOnline: {}
    };
  }

  async componentDidMount() {
    const accounts = await this.props.client.richList();
    const officialRepresentatives = await this.props.client.officialRepresentatives();
    const representativesOnline = await this.props.client.representativesOnline();

    this.setState({ accounts, officialRepresentatives, representativesOnline });
  }

  top100Balance() {
    return _.sum(this.state.accounts.map(account => account.balance));
  }

  top100Percentage() {
    return (
      Math.round(
        this.top100Balance() / this.props.config.maxCoinSupply * 10000
      ) / 100
    );
  }

  officialRepAccounts() {
    const officialReps = _.keys(this.state.officialRepresentatives);
    return this.state.accounts.filter(account =>
      officialReps.includes(account.representative)
    );
  }

  topAccountsOnline() {
    const { accounts, representativesOnline } = this.state;
    const repAccounts = _.keys(representativesOnline);
    return accounts.filter(account => repAccounts.includes(account.account));
  }

  accountsWithOfflineRep() {
    const { accounts, representativesOnline } = this.state;
    const repAccounts = _.keys(representativesOnline);
    return accounts.filter(
      account => !repAccounts.includes(account.representative)
    );
  }

  render() {
    const { officialRepresentatives, representativesOnline } = this.state;

    return (
      <div className="p-4">
        <div className="row justify-content-center my-5 mx-0">
          <div className="col col-md-10">
            <h3 className="text-muted mb-0">
              <span className="text-dark">
                {this.top100Percentage()}% of the total supply
              </span>{" "}
              is held by the top 100 accounts
            </h3>
            <p className="text-muted">
              That's {accounting.formatNumber(this.top100Balance(), 0)} NANO out
              of the{" "}
              {accounting.formatNumber(this.props.config.maxCoinSupply, 0)} NANO{" "}
              circulating supply
            </p>

            <h4>
              {this.officialRepAccounts().length}% are delegating their weight
              to official representatives
            </h4>
            <h4>
              {this.accountsWithOfflineRep().length}% are delegating their
              weight to offline representatives
            </h4>
            <h4>
              {this.topAccountsOnline().length} accounts are currently online
            </h4>
          </div>
        </div>

        <div className="row justify-content-center my-5 mx-0">
          <div className="col col-md-10">
            <h1 className="mb-0">Top 100 Accounts</h1>
            <p className="text-muted">Sorted by balance</p>

            <hr />

            {this.state.accounts.map(account => (
              <TopAccount
                key={account.account}
                account={account}
                officialRep={_.keys(officialRepresentatives).includes(
                  account.representative
                )}
                online={_.keys(representativesOnline).includes(account.account)}
                repOnline={_.keys(representativesOnline).includes(
                  account.representative
                )}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const TopAccount = ({ account, officialRep, online, repOnline }) => {
  const repStatus = officialRep ? "text-danger" : "text-muted";
  const onlineBadge = online ? (
    <span className="badge badge-info mr-1">Online</span>
  ) : (
    ""
  );
  const repOnlineBadge = repOnline ? (
    <span className="badge badge-success mr-1">Representative online</span>
  ) : (
    <span className="badge badge-danger mr-1">Representative offline</span>
  );

  return (
    <Fragment>
      <div className="row">
        <div className="col col-md-9">
          <h5 className="mb-0">
            <AccountLink
              account={account.account}
              className="text-dark break-word"
              ninja
            />
          </h5>
          <p className={repStatus}>
            {onlineBadge}
            {repOnlineBadge}
            Represented by{" "}
            <AccountLink
              account={account.representative}
              className={`${repStatus} break-word`}
              ninja
              short
            />
          </p>
        </div>
        <div className="col col-md-3 text-right">
          <PriceWithConversions
            amount={account.balance}
            currencies={["nano", "usd", "btc"]}
            precision={{ nano: 0, usd: 2, btc: 2 }}
          >
            {(nano, usd, btc) => (
              <Fragment>
                <h5 className="mb-0">{nano}</h5>

                <p className="text-muted mb-0">
                  {usd} / {btc}
                </p>
              </Fragment>
            )}
          </PriceWithConversions>
        </div>
      </div>

      <hr />
    </Fragment>
  );
};

export default injectClient(RichList);
