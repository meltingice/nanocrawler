import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { FormattedNumber } from "react-intl";
import { apiClient } from "lib/Client";

import AccountLink from "app/partials/AccountLink";
import PriceWithConversions from "app/partials/PriceWithConversions";
import DistributionGraph from "app/partials/explorer/frontiers/DistributionGraph";
import DistributionStats from "app/partials/explorer/frontiers/DistributionStats";
import AccountList from "app/partials/explorer/frontiers/AccountList";

export default class Accounts extends React.Component {
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
    const distribution = await apiClient.wealthDistribution();

    this.setState({
      totalAccounts: total,
      accounts,
      distribution
    });
  }

  async loadAccounts(page = this.state.page) {
    return await apiClient.frontierList(page);
  }

  async setPage(page) {
    const accounts = await this.loadAccounts(page);
    this.setState({ page, accounts });
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

        <AccountList
          page={this.state.page}
          accounts={this.state.accounts}
          setPage={this.setPage.bind(this)}
        />
      </div>
    );
  }
}
