import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import last from "lodash/last";

import config from "client-config.json";
import { apiClient } from "lib/Client";
import Currency from "lib/Currency";
import { validateAddress } from "lib/util";

import AccountWebsocket from "lib/AccountWebsocket";

const PENDING_INTERVAL = 60 * 1000;

export default function withAccountData(WrappedComponent) {
  return class AccountDataProvider extends React.Component {
    static propTypes = {
      account: PropTypes.string.isRequired
    };

    state = {
      balance: 0,
      pending: 0,
      representative: null,
      weight: 0,
      blockCount: 0,
      version: "0",
      unopened: false,
      loading: true,

      history: [],
      nextPageHead: null,
      pendingTransactions: null
    };

    accountTimeout = null;
    pendingTimeout = null;
    websocket = null;

    accountIsValid() {
      const { account } = this.props;
      return validateAddress(account);
    }

    async componentDidMount() {
      await this.fetchAccount();
      await this.fetchHistory();
      this.fetchPending();
      this.connectWebsocket();
    }

    componentWillUnmount() {
      if (this.accountTimeout) clearTimeout(this.accountTimeout);
      if (this.pendingTimeout) clearTimeout(this.pendingTimeout);
      if (this.websocket) this.disconnectWebsocket();
    }

    async fetchAccount() {
      const { account } = this.props;

      const error = () => this.setState({ unopened: true, loading: false });

      try {
        const data = await apiClient.account(account);
        if (data.error) return error();

        this.setState(
          {
            balance: data.balance,
            pending: data.pending,
            representative: data.representative,
            weight: data.weight,
            blockCount: parseFloat(data.block_count, 10),
            version: data.account_version,
            unopened: false
          },
          () => {
            this.accountTimeout = setTimeout(
              this.fetchAccount.bind(this),
              60000
            );
          }
        );
      } catch (e) {
        error();
      }
    }

    async fetchHistory() {
      const { account } = this.props;
      const { history, nextPageHead } = this.state;

      try {
        let resp = await apiClient.history(account, nextPageHead);

        if (nextPageHead) {
          resp = resp.slice(1);
        }

        if (resp === "") return;
        const updatedHistory = history.concat(resp);

        this.setState({
          loading: false,
          history: updatedHistory,
          nextPageHead: last(updatedHistory).hash
        });
      } catch (e) {
        this.setState({ loading: false });
      }
    }

    async fetchPending() {
      const { account } = this.props;

      try {
        const pendingTransactions = await apiClient.pendingTransactions(
          account
        );

        pendingTransactions.blocks = pendingTransactions.blocks.map(block => {
          block.account = block.source;
          return block;
        });

        this.setState({
          pendingTransactions,
          pending: pendingTransactions.pendingBalance
        });
      } catch (e) {
        // We don't have to fail hard if this doesn't work
      } finally {
        this.pendingTimeout = setTimeout(
          this.fetchPending.bind(this),
          PENDING_INTERVAL
        );
      }
    }

    async connectWebsocket() {
      this.websocket = new AccountWebsocket(config.websocketServer);

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

    disconnectWebsocket() {
      this.websocket.disconnect();
      this.websocket = null;
    }

    async onWebsocketEvent(event) {
      let {
        history,
        balance,
        blockCount,
        pendingTransactions,
        representative
      } = this.state;

      const removeBlockFromPending = () => {
        // Remove the transaction from pending transactions
        const pendingIndex = pendingTransactions.blocks.findIndex(
          block => block.hash === event.block.link
        );

        if (pendingIndex >= 0) {
          pendingTransactions.blocks.splice(pendingIndex, 1);
          pendingTransactions.total -= 1;
        }
      };

      event.block.hash = event.hash;
      event.block.timestamp = event.timestamp || event.local_timestamp;
      event.block.amount = Currency.toRaw(event.block.amount);

      switch (event.block.type) {
        case "receive":
          balance = Currency.addRaw(balance, event.block.amount);

          // Need to fetch the source block to get the sender
          const sendBlock = await apiClient.block(event.block.source);
          event.block.account = sendBlock.block_account;

          removeBlockFromPending();

          break;
        case "send":
          event.block.account = event.block.destination;
          balance = Currency.subtractRaw(balance, event.block.amount);

          break;
        case "change":
          representative = event.block.representative;
          break;
        case "state":
          representative = event.block.representative;
          if (event.is_send === "true") {
            balance = Currency.subtractRaw(balance, event.block.amount);
            event.block.account = event.block.link_as_account;
            event.block.subtype = "send";
          } else {
            balance = Currency.addRaw(balance, event.block.amount);

            if (parseInt(event.block.previous, 16) === 0) {
              event.block.subtype = "open";
              removeBlockFromPending();
            } else if (parseInt(event.block.link, 16) === 0) {
              event.block.subtype = "change";
            } else {
              event.block.subtype = "receive";

              // Need to fetch the source block to get the sender
              const sendBlock = await apiClient.block(event.block.link);
              event.block.account = sendBlock.block_account;

              removeBlockFromPending();
            }
          }

          break;
      }

      history.unshift(event.block);

      this.setState({
        history,
        blockCount: blockCount + 1,
        unopened: false,
        representative,
        pendingTransactions,
        balance
      });
    }

    render() {
      if (!this.accountIsValid()) {
        return this.redirect();
      }

      return (
        <WrappedComponent
          {...this.state}
          {...this.props}
          loadMore={this.fetchHistory.bind(this)}
          hasMore={this.state.blockCount > this.state.history.length}
        />
      );
    }

    redirect() {
      return <Redirect to="/explorer" />;
    }
  };
}
