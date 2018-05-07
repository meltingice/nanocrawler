import React, { Fragment } from "react";
import _ from "lodash";
import { Redirect } from "react-router-dom";
import accounting from "accounting";

import injectClient from "../../../lib/ClientComponent";
import AccountWebsocket from "../../../lib/AccountWebsocket";
import NanoNodeNinja from "../../../lib/NanoNodeNinja";

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
      representativesOnline: {},
      history: [],
      pendingTransactions: { blocks: [], total: 0 },
      delegators: {},
      weight: 0,
      block_count: 0,
      failed: false,
      nextPageHead: null,
      uptime: 0
    };

    this.accountTimeout = this.pendingTimeout = null;
    this.websocket = new AccountWebsocket(this.props.config.websocketServer);
  }

  async componentDidMount() {
    this.fetchData();

    try {
      await this.websocket.connect();
      this.websocket.subscribeAccount(
        this.props.match.params.account,
        this.onWebsocketEvent.bind(this)
      );
    } catch (e) {
      console.log(e.message);
    }
  }

  componentWillUnmount() {
    this.clearTimers();
    this.websocket.disconnect();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.account !== this.props.match.params.account) {
      this.clearTimers();

      this.websocket.unsubscribeAccount(prevProps.match.params.account);
      this.websocket.subscribeAccount(
        this.props.match.params.account,
        this.onWebsocketEvent.bind(this)
      );

      this.setState({ history: [], nextPageHead: null });
      this.fetchData();
    }
  }

  async fetchData() {
    await this.fetchAccount();
    this.fetchOnlineReps();
    this.fetchUptime();
    this.fetchHistory();
    this.fetchPending();
    this.fetchDelegators();
  }

  async onWebsocketEvent(event) {
    let { history, balance, representative, block_count } = this.state;

    event.block.hash = event.hash;
    event.block.timestamp = event.timestamp;
    switch (event.block.type) {
      case "receive":
        balance += parseFloat(event.block.amount, 10);

        // Need to fetch the source block to get the sender
        const sendBlock = await this.props.client.block(event.block.source);
        event.block.account = sendBlock.block_account;
        break;
      case "send":
        event.block.account = event.block.destination;
        balance -= parseFloat(event.block.amount, 10);
        break;
      case "change":
        representative = event.block.representative;
        break;
      case "state":
        representative = event.block.representative;
        if (event.is_send === "true") {
          balance -= parseFloat(event.block.amount, 10);
          event.block.subtype = "send";
        } else {
          balance += parseFloat(event.block.amount, 10);
          if (parseInt(event.block.previous, 16) === 0) {
            event.block.subtype = "open";
          } else if (parseInt(event.block.link, 16) === 0) {
            event.block.subtype = "change";
          } else {
            event.block.subtype = "receive";
          }
        }

        break;
    }

    history.unshift(event.block);
    block_count++;

    this.setState({ history, balance, representative, block_count });
  }

  loadMore() {
    this.fetchHistory();
  }

  hasMore() {
    return parseInt(this.state.block_count, 10) > this.state.history.length;
  }

  clearTimers() {
    if (this.accountTimeout) clearTimeout(this.accountTimeout);
    if (this.pendingTimeout) clearTimeout(this.pendingTimeout);
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

  async fetchOnlineReps() {
    const representativesOnline = await this.props.client.representativesOnline();
    this.setState({ representativesOnline });
  }

  async fetchUptime() {
    const { match } = this.props;
    const ninja = new NanoNodeNinja(match.params.account);
    await ninja.fetch();
    this.setState({ uptime: ninja.data.uptime });
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
    } catch (e) {
      this.setState({ failed: true });
    }
  }

  async fetchPending() {
    const { match } = this.props;

    try {
      const pendingTransactions = await this.props.client.pendingTransactions(
        match.params.account
      );
      this.setState({ pendingTransactions });

      this.pendingTimeout = setTimeout(this.fetchPending.bind(this), 10000);
    } catch (e) {
      // We don't have to fail hard if this doesn't work
    }
  }

  async fetchDelegators() {
    const { match } = this.props;

    const delegators = await this.props.client.delegators(match.params.account);
    this.setState({ delegators });
  }

  accountIsValid() {
    const { match } = this.props;
    return /^(xrb|nano)_[A-Za-z0-9]{59,60}$/.test(match.params.account);
  }

  hasDelegatedWeight() {
    const { delegators } = this.state;
    return (
      _.values(delegators).filter(amt => parseInt(amt, 10) > 1).length >= 0
    );
  }

  accountTitle() {
    const { weight, delegators } = this.state;

    if (weight >= 133248.289) return "Rebroadcasting Account";
    if (_.keys(delegators).length > 0) return "Representative Account";
    return "Account";
  }

  pendingTransactions() {
    return this.state.pendingTransactions.blocks.map(block => {
      block.account = block.source;
      return block;
    });
  }

  representativeOnline() {
    const { representative } = this.state;
    return _.keys(this.state.representativesOnline).includes(representative);
  }

  representativeOnlineStatus() {
    return this.representativeOnline() ? (
      <span className="badge badge-success mr-1">Representative online</span>
    ) : (
      <span className="badge badge-danger mr-1">Representative offline</span>
    );
  }

  representativeOfflineWarning() {
    if (_.isEmpty(this.state.representativesOnline)) return;
    if (!this.hasDelegatedWeight()) return;
    if (this.state.uptime > 95) return;

    return (
      <div className="alert alert-danger">
        This representative account is frequently offline. If you are delegating
        your voting weight to it, you may want to consider switching to a{" "}
        <a
          href="https://nanonode.ninja/"
          target="_blank"
          className="alert-link"
        >
          verified one that is online
        </a>.
      </div>
    );
  }

  render() {
    const { match } = this.props;
    const {
      balance,
      pending,
      history,
      representative,
      pendingTransactions
    } = this.state;

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
            <h1 className="mb-0">{this.accountTitle()}</h1>
            <p className="text-muted mb-0 break-word">{match.params.account}</p>

            <p className="text-muted mb-0">
              {this.representativeOnlineStatus()}
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

        {this.representativeOfflineWarning()}

        <NodeNinjaAccount account={match.params.account} />

        {this.getPendingTransactions()}

        <div className="row mt-5 align-items-center">
          <div className="col">
            <h2>Transactions</h2>
          </div>
          <div className="col-auto">
            <h4>
              {accounting.formatNumber(this.state.block_count)}{" "}
              <span className="text-muted">transactions total</span>
            </h4>
          </div>
        </div>

        <TransactionHistory history={history} />

        {this.getLoadMore()}

        {this.getDelegators()}
      </div>
    );
  }

  getPendingTransactions() {
    const { pendingTransactions } = this.state;
    if (pendingTransactions.total === 0) return;

    return (
      <Fragment>
        <div className="row mt-5 align-items-center">
          <div className="col">
            <h2 className="mb-0">Pending Transactions</h2>
            <p className="text-muted">Only showing up to 20 pending deposits</p>
          </div>
          <div className="col-auto">
            <h4>
              {accounting.formatNumber(pendingTransactions.total)}{" "}
              <span className="text-muted">pending transactions</span>
            </h4>
          </div>
        </div>

        <TransactionHistory history={this.pendingTransactions()} />
      </Fragment>
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

    if (_.values(delegators).filter(amt => parseInt(amt, 10) > 1).length === 0)
      return;

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
