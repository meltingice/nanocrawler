import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { FormattedNumber } from "react-intl";
import injectClient from "lib/ClientComponent";

import AccountLink from "../../partials/AccountLink";
import PriceWithConversions from "../../partials/PriceWithConversions";
import DistributionGraph from "../../partials/explorer/frontiers/DistributionGraph";
import DistributionStats from "../../partials/explorer/frontiers/DistributionStats";

class Accounts extends React.PureComponent {
  state = {
    accounts: [],
    distribution: null,
    page: 1
  };

  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      totalAccounts: 0,
      accounts: [],
      distribution: {}
    };
  }

  async componentDidMount() {
    const { total, accounts } = await this.loadAccounts();
    const distribution = await this.props.client.wealthDistribution();

    this.setState({
      totalAccounts: total,
      accounts,
      distribution
    });
  }

  async loadAccounts() {
    return await this.props.client.frontierList(this.state.page);
  }

  render() {
    return (
      <div id="FrontierList" className="p-4">
        <Helmet>
          <title>All Accounts</title>
        </Helmet>

        <div className="row">
          <div className="col">
            <h1>NANO Distribution</h1>
            <hr />

            <DistributionGraph distribution={this.state.distribution} />
            <DistributionStats distribution={this.state.distribution} />
          </div>
        </div>

        <div className="row mt-5 align-items-center">
          <div className="col">
            <h1 className="mb-0">All Accounts</h1>
            <p className="text-muted">
              Only accounts with a balance, sorted by balance
            </p>
          </div>
          <div className="col-auto">
            <h4 className="text-muted">
              <FormattedNumber value={this.state.totalAccounts} /> accounts
            </h4>
          </div>
        </div>

        <hr />
      </div>
    );
  }
}

export default injectClient(Accounts);
