import React, { Fragment } from "react";
import _ from "lodash";
import { Redirect } from "react-router-dom";
import accounting from "accounting";

import injectClient from "../../../lib/ClientComponent";

import AccountQR from "../../partials/AccountQR";
import PriceWithConversions from "../../partials/PriceWithConversions";
import NodeNinjaAccount from "../../partials/explorer/account/NodeNinjaAccount";
import TransactionHistory from "../../partials/explorer/account/TransactionHistory";
import DelegatorsTable from "../../partials/explorer/account/DelegatorsTable";

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      balance: 0,
      pending: 0,
      history: [],
      delegators: {},
      weight: 0
    };

    this.balanceTimeout = this.historyTimeout = null;
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

      this.fetchData();
    }
  }

  fetchData() {
    this.fetchBalance();
    this.fetchHistory();
    this.fetchDelegators();
  }

  clearTimers() {
    if (this.balanceTimeout) clearTimeout(this.balanceTimeout);
    if (this.historyTimeout) clearTimeout(this.historyTimeout);
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

  async fetchDelegators() {
    const { match } = this.props;

    let delegators = {};
    const weight = await this.props.client.weight(match.params.account);
    if (weight >= 256) {
      delegators = await this.props.client.delegators(match.params.account);
    }

    this.setState({ weight, delegators });
  }

  async fetchWeight() {
    const { match } = this.props;
    const weight = await this.props.client.weight(match.params.account);
    this.setState({ weight });
  }

  accountIsValid() {
    const { match } = this.props;
    return /^(xrb_|nano_)/.test(match.params.account);
  }

  isRepresentative() {
    const { weight } = this.state;
    return weight >= 256;
  }

  render() {
    const { match } = this.props;
    const { balance, pending, history } = this.state;

    if (!this.accountIsValid()) {
      return this.redirect();
    }

    return (
      <div className="p-4">
        <div className="row align-items-center ">
          <div className="col">
            <h1 className="mb-0">
              {this.isRepresentative() ? "Representative " : ""}Account
            </h1>
            <p className="text-muted" style={{ wordWrap: "break-word" }}>
              {match.params.account}
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
          <p className="text-muted">Showing the last 20 transactions</p>
          <TransactionHistory history={history} />
        </div>

        {this.getDelegators()}
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
            <p className="text-muted">
              {_.keys(delegators).length} delegators, sorted by weight
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
