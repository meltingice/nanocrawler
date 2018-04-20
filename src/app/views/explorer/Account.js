import React from "react";
import accounting from "accounting";

import injectClient from "../../../lib/ClientComponent";
import TransactionHistory from "../../partials/TransactionHistory";

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
    if (this.balanceTimeout) clearTimeout(this.balanceTimeout);
    if (this.historyTimeout) clearTimeout(this.historyTimeout);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.account !== this.props.match.params.account) {
      this.fetchBalance();
      this.fetchHistory();
    }
  }

  async fetchBalance() {
    const { match } = this.props;
    const balance = await this.props.client.balance(match.params.account);
    this.setState({ ...balance });

    this.balanceTimeout = setTimeout(this.fetchBalance.bind(this), 60000);
  }

  async fetchHistory() {
    const { match } = this.props;
    const history = await this.props.client.history(match.params.account);
    this.setState({ history });

    this.historyTimeout = setTimeout(this.fetchHistory.bind(this), 60000);
  }

  render() {
    const { match } = this.props;
    const { balance, pending, history } = this.state;

    return (
      <div className="p-4">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="mb-0">Account</h1>
            <p className="text-muted" style={{ wordWrap: "break-word" }}>
              {match.params.account}
            </p>
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
