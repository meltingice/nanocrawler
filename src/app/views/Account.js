import React from 'react'
import accounting from 'accounting'

import Client from '../../lib/Client'
import TransactionHistory from '../partials/TransactionHistory'

export default class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      balance: 0,
      pending: 0,
      history: []
    }

    this.client = new Client();
    this.balanceTimeout = this.historyTimeout = null;
  }

  componentWillMount() {
    this.fetchBalance()
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
    const balance = await this.client.balance();
    this.setState({ ...balance });

    this.balanceTimeout = setTimeout(this.fetchBalance.bind(this), 60000);
  }

  async fetchHistory() {
    const history = await this.client.history();
    this.setState({ history });

    this.historyTimeout = setTimeout(this.fetchHistory.bind(this), 60000);
  }

  render() {
    const { balance, pending, history } = this.state;

    return (
      <div className="p-4">
        <div className="row align-items-center">
          <div className="col">
            <h1>Account</h1>
          </div>
          <div className="col col-auto">
            <h3 className="mb-0">{accounting.formatNumber(balance, 6)} <span className="text-muted">NANO</span></h3>
            <p className="text-muted">{accounting.formatNumber(pending, 6)} pending</p>
          </div>
        </div>

        <hr />

        <h2>Transactions</h2>
        <TransactionHistory history={history} />
      </div>
    )
  }
}
