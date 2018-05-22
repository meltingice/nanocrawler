import React, { Fragment } from "react";
import _ from "lodash";
import accounting from "accounting";
import TransactionHistory from "./TransactionHistory";

import injectClient from "../../../../lib/ClientComponent";
import AccountWebsocket from "../../../../lib/AccountWebsocket";

class AccountHistory extends React.Component {
  state = {
    history: [],
    nextPageHead: null,
    pendingTransactions: null
  };

  constructor(props) {
    super(props);

    this.websocket = new AccountWebsocket(this.props.config.websocketServer);
    this.pendingTimeout = null;
  }

  async componentDidMount() {
    this.fetchData();

    try {
      await this.websocket.connect();
      this.websocket.subscribeAccount(
        this.props.account,
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
    if (prevProps.account !== this.props.account) {
      this.clearTimers();

      this.websocket.unsubscribeAccount(prevProps.account);
      this.websocket.subscribeAccount(
        this.props.account,
        this.onWebsocketEvent.bind(this)
      );

      this.setState(
        {
          history: [],
          nextPageHead: null,
          pendingTransactions: null
        },
        this.fetchData.bind(this)
      );
    }
  }

  clearTimers() {
    if (this.pendingTimeout) clearTimeout(this.pendingTimeout);
  }

  async fetchData() {
    this.fetchHistory();
    this.fetchPending();
  }

  async fetchHistory() {
    const { account } = this.props;
    let { history, nextPageHead } = this.state;

    try {
      let resp = await this.props.client.history(
        account,
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
    const { account } = this.props;

    try {
      const pendingTransactions = await this.props.client.pendingTransactions(
        account
      );
      this.setState({ pendingTransactions });

      this.pendingTimeout = setTimeout(this.fetchPending.bind(this), 10000);
    } catch (e) {
      // We don't have to fail hard if this doesn't work
    }
  }

  async onWebsocketEvent(event) {
    let { history } = this.state;
    let { balance, blockCount } = this.props;
    let representative;

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
    blockCount++;

    this.setState({ history });
    // this.props.onAccountUpdate({ balance, representative, block_count: blockCount })
  }

  loadMore() {
    this.fetchHistory();
  }

  hasMore() {
    return this.props.blockCount > this.state.history.length;
  }

  pendingTransactions() {
    return this.state.pendingTransactions.blocks.map(block => {
      block.account = block.source;
      return block;
    });
  }

  render() {
    const { history } = this.state;

    return (
      <Fragment>
        {this.getPendingTransactions()}

        <div className="row mt-5 align-items-center">
          <div className="col">
            <h2>Transactions</h2>
          </div>
          <div className="col-auto">
            <h4>
              {accounting.formatNumber(this.props.block_count)}{" "}
              <span className="text-muted">transactions total</span>
            </h4>
          </div>
        </div>

        <TransactionHistory history={history} />

        {this.getLoadMore()}
      </Fragment>
    );
  }

  getPendingTransactions() {
    const { pendingTransactions } = this.state;
    if (!pendingTransactions || pendingTransactions.total === 0) return;

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
}

export default injectClient(AccountHistory);
