import React from "react";
import accounting from "accounting";

import injectClient from "../../lib/ClientComponent";
import TransactionHistory from "../partials/TransactionHistory";

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      balance: 0,
      pending: 0,
      history: []
    };

    this.balanceTimeout = this.historyTimeout = null;
  }

  componentWillMount() {
    this.fetchBalance();
    this.fetchHistory();
  }

  componentWillUnmount() {
    if (this.balanceTimeout) {
      clearTimeout(this.balanceTimeout);
      this.balanceTimeout = null;
    }

    if (this.historyTimeout) {
      clearTimeout(this.historyTimeout);
      this.historyTimeout = null;
    }
  }

  async fetchBalance() {
    const balance = await this.props.client.balance();
    this.setState({ ...balance });

    this.balanceTimeout = setTimeout(this.fetchBalance.bind(this), 60000);
  }

  async fetchHistory() {
    const history = await this.props.client.history();
    this.setState({ history });

    this.historyTimeout = setTimeout(this.fetchHistory.bind(this), 60000);
  }

  render() {
    const { balance, pending, history } = this.state;

    return (
      <div className="p-4">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="mb-0">Account</h1>
            <p className="text-muted">{this.props.account}</p>
          </div>
          <div className="col col-auto">
            <h3 className="mb-0">
              {accounting.formatNumber(balance, 6)}{" "}
              <span className="text-muted">NANO</span>
            </h3>
            <p className="text-muted">
              {accounting.formatNumber(pending, 6)} pending
            </p>
          </div>
        </div>

        <hr />

        <h2>Transactions</h2>
        <TransactionHistory history={history} />
      </div>
    );
  }
}

export default injectClient(Account);
