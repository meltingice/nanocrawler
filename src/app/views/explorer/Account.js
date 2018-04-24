import React, { Fragment } from "react";
import _ from "lodash";
import { Redirect } from "react-router-dom";
import accounting from "accounting";

import injectClient from "../../../lib/ClientComponent";

import AccountLink from "../../partials/AccountLink";
import AccountQR from "../../partials/AccountQR";
import PriceWithConversions from "../../partials/PriceWithConversions";
import NodeNinjaAccount from "../../partials/explorer/account/NodeNinjaAccount";
import TransactionHistory from "../../partials/explorer/account/TransactionHistory";
import DelegatorsTable from "../../partials/explorer/account/DelegatorsTable";
import UnopenedAccount from "../../partials/explorer/account/UnopenedAccount";

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      balance: 0,
      pending: 0,
      representative: null,
      history: [],
      delegators: {},
      weight: 0,
      block_count: 0,
      failed: false,
      nextPageHead: null
    };

    this.accountTimeout = this.historyTimeout = null;
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.clearTimers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.account !== this.props.match.params.account) {
      this.clearTimers();
      this.setState({ history: [], nextPageHead: null });
      this.fetchData();
    }
  }

  async fetchData() {
    await this.fetchAccount();
    this.fetchHistory();
    this.fetchDelegators();
  }

  loadMore() {
    if (this.historyTimeout) clearTimeout(this.historyTimeout);
    this.fetchHistory();
  }

  hasMore() {
    return parseInt(this.state.block_count, 10) > this.state.history.length;
  }

  clearTimers() {
    if (this.accountTimeout) clearTimeout(this.accountTimeout);
    if (this.historyTimeout) clearTimeout(this.historyTimeout);
  }

  async fetchAccount() {
    const { match } = this.props;
    try {
      const account = await this.props.client.account(match.params.account);
      return this.setState({ ...account });

      this.accountTimeout = setTimeout(this.fetchAccount.bind(this), 60000);
    } catch (e) {
      return this.setState({ failed: true });
    }
  }

  async fetchHistory() {
    const { match } = this.props;
    let { history, nextPageHead } = this.state;

    try {
      let resp = await this.props.client.history(
        match.params.account,
        this.state.nextPageHead
      );

      if (nextPageHead) {
        resp = resp.slice(1);
      }

      history = history.concat(resp);

      nextPageHead = _.last(history).hash;
      this.setState({ history, nextPageHead, failed: false });

      this.historyTimeout = setTimeout(this.fetchHistory.bind(this), 60000);
    } catch (e) {
      this.setState({ failed: true });
    }
  }

  async fetchDelegators() {
    const { match } = this.props;
    const { weight } = this.state;

    if (weight < 256) return;

    const delegators = await this.props.client.delegators(match.params.account);
    this.setState({ delegators });
  }

  accountIsValid() {
    const { match } = this.props;
    return /^(xrb|nano)_[A-Za-z0-9]{59,60}$/.test(match.params.account);
  }

  isRepresentative() {
    const { weight } = this.state;
    return weight >= 256;
  }

  render() {
    const { match } = this.props;
    const { balance, pending, history, representative } = this.state;

    if (!this.accountIsValid()) {
      return this.redirect();
    }

    if (this.state.failed) {
      return <UnopenedAccount account={match.params.account} />;
    }

    return (
      <div className="p-4">
        <div className="row align-items-center ">
          <div className="col">
            <h1 className="mb-0">
              {this.isRepresentative() ? "Representative " : ""}Account
            </h1>
            <p className="text-muted mb-0 break-word">{match.params.account}</p>

            <p className="text-muted mb-0">
              Represented by{" "}
              <AccountLink
                account={representative}
                short
                ninja
                className="text-muted"
              />
            </p>
          </div>
          <div className="col-auto">
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
                      {accounting.formatNumber(pending, 6)} NANO pending
                    </p>
                  </Fragment>
                );
              }}
            </PriceWithConversions>
          </div>
        </div>

        <hr />

        <NodeNinjaAccount account={match.params.account} />

        <div className="mt-5">
          <h2 className="mb-0">Transactions</h2>
          <p className="text-muted">
            {this.state.block_count} transactions total
          </p>
          <TransactionHistory history={history} />

          {this.getLoadMore()}
        </div>

        {this.getDelegators()}
      </div>
    );
  }

  getLoadMore() {
    if (!this.hasMore()) return;
    return (
      <div className="text-center">
        <button
          className="btn btn-nano-primary"
          onClick={this.loadMore.bind(this)}
        >
          Load More Transactions
        </button>
      </div>
    );
  }

  getDelegators() {
    const { delegators, weight } = this.state;
    if (!this.isRepresentative()) return;

    return (
      <div className="mt-5">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="mb-0">Delegators</h2>
            <p className="text-muted mb-0">
              {_.keys(delegators).length} delegators, sorted by weight
            </p>
            <p className="text-muted">
              Only showing accounts with at least 1 NANO
            </p>
          </div>
          <div className="col-auto">
            <h3 className="mb-0">
              {accounting.formatNumber(weight)}{" "}
              <span className="text-muted">NANO weight</span>
            </h3>
          </div>
        </div>
        <DelegatorsTable delegators={delegators} />
      </div>
    );
  }

  redirect() {
    return <Redirect to="/explorer" />;
  }
}

export default injectClient(Account);
