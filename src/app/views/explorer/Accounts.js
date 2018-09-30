import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { FormattedNumber } from "react-intl";
import { apiClient } from "lib/Client";

import AccountLink from "app/partials/AccountLink";
import PriceWithConversions from "app/partials/PriceWithConversions";
import DistributionGraph from "app/partials/explorer/frontiers/DistributionGraph";
import DistributionStats from "app/partials/explorer/frontiers/DistributionStats";
import Pagination from "app/partials/Pagination";
import AccountList from "app/partials/explorer/frontiers/AccountList";

export default class Accounts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: parseInt(this.props.match.params.page, 10),
      perPage: 50,
      totalAccounts: 0,
      accounts: [],
      distribution: {}
    };
  }

  async componentDidMount() {
    const { total, perPage, accounts } = await this.loadAccounts();
    const distribution = await apiClient.wealthDistribution();

    this.setState({
      totalAccounts: total,
      perPage,
      accounts,
      distribution
    });
  }

  async loadAccounts(page = this.state.page) {
    return await apiClient.frontierList(page);
  }

  async setPage(page) {
    const { total, accounts } = await this.loadAccounts(page);
    this.setState({ page, accounts, totalAccounts: total }, () => {
      this.props.history.push(`/explorer/accounts/${page}`);
    });
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

        <div className="row justify-content-center my-2">
          <div className="col-auto">
            <Pagination
              page={this.state.page}
              totalCount={this.state.totalAccounts}
              perPage={this.state.perPage}
              onPageSelected={this.setPage.bind(this)}
            />
          </div>
        </div>

        <AccountList
          page={this.state.page}
          accounts={this.state.accounts}
          setPage={this.setPage.bind(this)}
        />

        <div className="row justify-content-center my-2">
          <div className="col-auto">
            <Pagination
              page={this.state.page}
              totalCount={this.state.totalAccounts}
              perPage={this.state.perPage}
              onPageSelected={this.setPage.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}
