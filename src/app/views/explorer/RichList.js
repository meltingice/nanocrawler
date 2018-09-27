import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { FormattedNumber } from "react-intl";
import injectClient from "lib/ClientComponent";

import AccountLink from "../../partials/AccountLink";
import PriceWithConversions from "../../partials/PriceWithConversions";
import DistributionGraph from "../../partials/explorer/frontiers/DistributionGraph";
import DistributionStats from "../../partials/explorer/frontiers/DistributionStats";

class RichList extends React.PureComponent {
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
    const { total, accounts } = this.loadAccounts();
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
      </div>
    );
  }
}

export default injectClient(RichList);
