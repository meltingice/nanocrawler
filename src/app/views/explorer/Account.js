import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import keys from "lodash/keys";
import isEmpty from "lodash/isEmpty";
import { NavLink } from "react-router-dom";
import Clipboard from "react-clipboard.js";
import { injectIntl, FormattedNumber } from "react-intl";
import { TranslatedMessage, withDefault } from "lib/TranslatedMessage";
import { withNetworkData } from "lib/NetworkContext";
import Currency from "lib/Currency";

import NanoNodeNinja from "lib/NanoNodeNinja";

import AccountLink from "app/partials/AccountLink";
import AccountQR from "app/partials/AccountQR";
import PriceWithConversions from "app/partials/PriceWithConversions";
import NodeNinjaAccount from "app/partials/explorer/account/NodeNinjaAccount";

import AccountHistory from "app/partials/explorer/account/AccountHistory";
import AccountDelegators from "app/partials/explorer/account/AccountDelegators";

import config from "client-config.json";
import withAccountData from "./AccountDataProvider";

class Account extends React.Component {
  state = { uptime: null };

  componentDidMount() {
    this.fetchUptime();
  }

  async fetchUptime() {
    const { account } = this.props;
    const ninja = new NanoNodeNinja(account);
    await ninja.fetch();

    if (ninja.hasAccount()) {
      this.setState({ uptime: ninja.data.uptime });
    }
  }

  hasDelegatedWeight() {
    const { weight } = this.props;
    return Currency.fromRaw(weight) > 0;
  }

  accountTitle() {
    const { formatMessage } = this.props.intl;
    const { account, weight, unopened } = this.props;

    if (account === config.donationAddress) {
      return formatMessage(withDefault({ id: "account.title.donation" }));
    }

    const mnano = Currency.fromRaw(weight);

    if (mnano >= Currency.fromRaw(this.props.network.onlineStake) * 0.001)
      return formatMessage(withDefault({ id: "account.title.rebroadcasting" }));
    if (mnano > 0)
      return formatMessage(withDefault({ id: "account.title.representative" }));
    if (unopened)
      return formatMessage(withDefault({ id: "account.title.unopened" }));
    return formatMessage(withDefault({ id: "account.title.normal" }));
  }

  representativeOnline() {
    const { representative, network } = this.props;
    return keys(network.representativesOnline).includes(representative);
  }

  representativeOnlineStatus() {
    const { formatMessage } = this.props.intl;

    return this.representativeOnline() ? (
      <span className="badge badge-success mr-1">
        <TranslatedMessage id="account.rep.online" />
      </span>
    ) : (
      <span
        className="badge badge-danger mr-1 tooltipped tooltipped-e tooltipped-multiline"
        aria-label={formatMessage(
          withDefault({ id: "account.rep_offline.desc" })
        )}
      >
        <TranslatedMessage id="account.rep.offline" />
      </span>
    );
  }

  accountVersionBadge() {
    const { version } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <span
        className="badge badge-info mr-1 tooltipped tooltipped-n tooltipped-multiline"
        aria-label={formatMessage(
          withDefault({ id: `account.version.${version}` })
        )}
        style={{ cursor: "help" }}
      >
        Version {version} <i className="fa fa-question-circle" />
      </span>
    );
  }

  representativeOfflineWarning() {
    const { representativesOnline } = this.props.network;
    if (isEmpty(representativesOnline)) return;
    if (!this.hasDelegatedWeight()) return;
    if (!this.state.uptime || this.state.uptime > 95) return;

    return (
      <div className="alert alert-warning">
        <TranslatedMessage
          id="account.rep_offline_warning"
          values={{
            uptime: (
              <Fragment>
                <FormattedNumber
                  value={this.state.uptime}
                  maximumFractionDigits={2}
                />
                %
              </Fragment>
            ),
            link: (
              <a
                href="https://mynano.ninja/"
                target="_blank"
                className="alert-link"
              >
                <TranslatedMessage id="account.rep_offline.warning_link" />
              </a>
            )
          }}
        />
      </div>
    );
  }

  render() {
    const { account, match, balance, pending, representative } = this.props;

    return (
      <div className="p-4">
        <Helmet
          key={window.location.href}
          title={`${this.accountTitle()} - ${account}`}
        />

        <div className="row align-items-center" style={{ overflow: "auto" }}>
          <div className="col-lg mb-2">
            <h1 className="mb-0">{this.accountTitle()}</h1>
            <p className="text-muted mb-0 break-word">
              <span className="text-monospace">{account}</span>

              <span
                className="tooltipped tooltipped-e ml-1"
                aria-label="Copy to clipboard"
              >
                <Clipboard
                  component="span"
                  style={{ cursor: "pointer" }}
                  data-clipboard-text={account}
                >
                  <i className="fa fa-clipboard" />
                </Clipboard>
              </span>
            </p>

            {this.getRepresentative()}

            <p className="mb-0">
              {this.representativeOnlineStatus()}
              {this.accountVersionBadge()}
            </p>
          </div>
          <div className="col-auto">
            <div className="row">
              <div className="col-auto pr-0">
                <AccountQR account={account} style={{ width: "80px" }} />
              </div>
              <div className="col">
                <PriceWithConversions
                  raw
                  amount={balance}
                  currencies={["base", "usd", "btc"]}
                >
                  {(base, usd, btc) => {
                    return (
                      <Fragment>
                        <ScaledAccountBalance
                          balance={balance}
                          displayValue={base}
                        />

                        <p className="text-muted mb-0">
                          {usd} / {btc}
                        </p>
                        <p className="text-muted mb-0">
                          <FormattedNumber
                            value={Currency.fromRaw(pending)}
                            minimumFractionDigits={2}
                            maximumFractionDigits={6}
                          />{" "}
                          {config.currency.shortName}{" "}
                          <TranslatedMessage id="pending" />
                        </p>
                      </Fragment>
                    );
                  }}
                </PriceWithConversions>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <ul className="nav nav-pills justify-content-center my-3">
          <li className="nav-item">
            <NavLink
              to={`/explorer/account/${account}/history`}
              className="nav-link nano"
              activeClassName="active"
              isActive={(m, l) => match.params.page === "history"}
            >
              <TranslatedMessage id="account.history" />
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to={`/explorer/account/${account}/delegators`}
              className="nav-link nano"
              activeClassName="active"
              isActive={(m, l) => match.params.page === "delegators"}
            >
              <TranslatedMessage id="account.delegators" />
            </NavLink>
          </li>
        </ul>

        {this.representativeOfflineWarning()}

        <NodeNinjaAccount account={account} />

        {this.getAccountContent()}
      </div>
    );
  }

  getRepresentative() {
    const { representative } = this.props;
    if (!representative) return;

    return (
      <p className="text-muted mb-0">
        <TranslatedMessage
          id="account.represented_by"
          values={{
            account: (
              <AccountLink
                account={representative}
                short
                ninja
                className="text-muted"
              />
            )
          }}
        />
      </p>
    );
  }

  getAccountContent() {
    const {
      match,
      unopened,
      account,
      history,
      pendingTransactions,
      blockCount,
      loadMore,
      hasMore,
      weight
    } = this.props;

    switch (match.params.page) {
      case "history":
        return this.props.loading ? (
          <Loading />
        ) : (
          <AccountHistory
            unopened={unopened}
            history={history}
            pendingTransactions={pendingTransactions}
            blockCount={blockCount}
            loadMore={loadMore}
            hasMore={hasMore}
          />
        );
      case "delegators":
        return <AccountDelegators account={account} weight={weight} />;
    }
  }
}

const ScaledAccountBalance = ({ balance, displayValue }) => {
  const mbalance = Currency.fromRaw(balance).toString();
  if (mbalance.length > 12) return <h5 className="mb-0">{displayValue}</h5>;
  return <h3 className="mb-0">{displayValue}</h3>;
};

const Loading = () => (
  <div className="my-5 text-center">
    <h2 className="text-muted">Loading transactions...</h2>
  </div>
);

export default withAccountData(withNetworkData(injectIntl(Account)));
