import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import _ from "lodash";
import { Redirect, NavLink } from "react-router-dom";
import Clipboard from "react-clipboard.js";
import { injectIntl, FormattedNumber } from "react-intl";
import { TranslatedMessage, withDefault } from "lib/TranslatedMessage";

import NanoNodeNinja from "lib/NanoNodeNinja";

import AccountLink from "../../partials/AccountLink";
import AccountQR from "../../partials/AccountQR";
import PriceWithConversions from "../../partials/PriceWithConversions";
import NodeNinjaAccount from "../../partials/explorer/account/NodeNinjaAccount";
import UnopenedAccount from "../../partials/explorer/account/UnopenedAccount";

import AccountHistory from "../../partials/explorer/account/AccountHistory";
import AccountDelegators from "../../partials/explorer/account/AccountDelegators";

import { apiClient } from "lib/Client";
import config from "client-config.json";

class Account extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      balance: 0,
      pending: 0,
      representative: null,
      representativesOnline: {},
      weight: 0,
      block_count: 0,
      failed: false,
      unopened: false,
      uptime: 0
    };

    this.accountTimeout = null;
  }

  async componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.clearTimers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.account !== this.props.match.params.account) {
      this.clearTimers();
      this.fetchData();
    }
  }

  async fetchData() {
    await this.fetchAccount();
    this.fetchOnlineReps();
    this.fetchUptime();
  }

  clearTimers() {
    if (this.accountTimeout) clearTimeout(this.accountTimeout);
  }

  async fetchAccount() {
    const { match } = this.props;
    try {
      const account = await apiClient.account(match.params.account);
      account.block_count = parseInt(account.block_count, 10);
      this.setState({ ...account, failed: false });

      this.accountTimeout = setTimeout(this.fetchAccount.bind(this), 60000);
    } catch (e) {
      this.setState({ unopened: true });
    }
  }

  async fetchOnlineReps() {
    const representativesOnline = await apiClient.representativesOnline();
    this.setState({ representativesOnline });
  }

  async fetchUptime() {
    const { match } = this.props;
    const ninja = new NanoNodeNinja(match.params.account);
    await ninja.fetch();
    this.setState({ uptime: ninja.data.uptime });
  }

  accountIsValid() {
    const { match } = this.props;
    return /^(xrb|nano)_[A-Za-z0-9]{59,60}$/.test(match.params.account);
  }

  hasDelegatedWeight() {
    const { weight } = this.state;
    return weight > 0;
  }

  accountTitle() {
    const { formatMessage } = this.props.intl;
    const { weight, unopened } = this.state;

    if (weight >= 133248.289)
      return formatMessage(withDefault({ id: "account.title.rebroadcasting" }));
    if (weight > 0)
      return formatMessage(withDefault({ id: "account.title.representative" }));
    if (unopened)
      return formatMessage(withDefault({ id: "account.title.unopened" }));
    return formatMessage(withDefault({ id: "account.title.normal" }));
  }

  representativeOnline() {
    const { representative } = this.state;
    return _.keys(this.state.representativesOnline).includes(representative);
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

  representativeOfflineWarning() {
    if (_.isEmpty(this.state.representativesOnline)) return;
    if (!this.hasDelegatedWeight()) return;
    if (!this.state.uptime || this.state.uptime > 95) return;

    return (
      <div className="alert alert-warning">
        <TranslatedMessage
          id="account.rep_offline_warning"
          values={{
            uptime: (
              <FormattedNumber
                value={this.state.uptime}
                maximumFractionDigits={2}
              />
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
    const { match } = this.props;
    const { balance, pending, representative } = this.state;

    if (!this.accountIsValid()) {
      return this.redirect();
    }

    if (this.state.failed) {
      return <UnopenedAccount account={match.params.account} />;
    }

    return (
      <div className="p-4">
        <Helmet>
          <title>
            {this.accountTitle()} - {match.params.account}
          </title>
        </Helmet>

        <div className="row align-items-center">
          <div className="col">
            <h1 className="mb-0">{this.accountTitle()}</h1>
            <p className="text-muted mb-0 break-word">
              {match.params.account}

              <span
                className="tooltipped tooltipped-e ml-1"
                aria-label="Copy to clipboard"
              >
                <Clipboard
                  component="span"
                  style={{ cursor: "pointer" }}
                  data-clipboard-text={match.params.account}
                >
                  <i className="fa fa-clipboard" />
                </Clipboard>
              </span>
            </p>

            {this.getRepresentative()}
          </div>
          <div className="col-auto pr-0">
            <AccountQR
              account={match.params.account}
              style={{ width: "80px" }}
            />
          </div>
          <div className="col-auto">
            <PriceWithConversions
              amount={balance}
              currencies={["nano", "usd", "btc"]}
            >
              {(nano, usd, btc) => {
                return (
                  <Fragment>
                    <h3 className="mb-0">{nano}</h3>

                    <p className="text-muted mb-0">
                      {usd} / {btc}
                    </p>
                    <p className="text-muted mb-0">
                      <FormattedNumber
                        value={pending}
                        maximumFractionDigits={6}
                      />{" "}
                      {config.currency} <TranslatedMessage id="pending" />
                    </p>
                  </Fragment>
                );
              }}
            </PriceWithConversions>
          </div>
        </div>

        <hr />

        <ul className="nav nav-pills justify-content-center my-3">
          <li className="nav-item">
            <NavLink
              to={`/explorer/account/${match.params.account}/history`}
              className="nav-link nano"
              activeClassName="active"
              isActive={(m, l) => match.params.page === "history"}
            >
              <TranslatedMessage id="account.history" />
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to={`/explorer/account/${match.params.account}/delegators`}
              className="nav-link nano"
              activeClassName="active"
              isActive={(m, l) => match.params.page === "delegators"}
            >
              <TranslatedMessage id="account.delegators" />
            </NavLink>
          </li>
        </ul>

        {this.representativeOfflineWarning()}

        <NodeNinjaAccount account={match.params.account} />

        {this.getAccountContent()}
      </div>
    );
  }

  getRepresentative() {
    const { representative } = this.state;
    if (!representative) return;

    return (
      <p className="text-muted mb-0">
        {this.representativeOnlineStatus()}
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
    const { match } = this.props;

    switch (match.params.page) {
      case "history":
        return (
          <AccountHistory
            account={match.params.account}
            blockCount={this.state.block_count}
            balance={this.state.balance}
          />
        );
      case "delegators":
        return (
          <AccountDelegators
            account={match.params.account}
            weight={this.state.weight}
          />
        );
    }
  }

  redirect() {
    return <Redirect to="/explorer" />;
  }
}

export default injectIntl(Account);
