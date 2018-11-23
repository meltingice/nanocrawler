import React, { Fragment } from "react";
import { FormattedNumber } from "react-intl";
import { Link } from "react-router-dom";
import { apiClient } from "lib/Client";
import Currency from "lib/Currency";

export default class SupplyStats extends React.Component {
  state = {
    circulating: null,
    available: null,
    loading: true
  };

  timeout = null;

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  async fetchData() {
    const data = await apiClient.supply();
    this.setState({ loading: false, ...data }, () => {
      this.timeout = setTimeout(this.fetchData.bind(this), 300000);
    });
  }

  get stats() {
    const { circulating } = this.state;

    return (
      <div className="row">
        <div className="col-lg">
          <h3 className="mb-0">
            <FormattedNumber
              value={circulating}
              maximumFractionDigits={2}
              minimumFractionDigits={2}
            />{" "}
            BAN <span className="text-muted">in circulation</span>
          </h3>
          <p className="text-muted">
            Banano is continuously distributed via airdrops, contests, games,
            and more. Join the community in{" "}
            <a href="http://chat.banano.co.in/" target="_blank">
              our Discord server
            </a>.
          </p>
          <p>
            <Link
              to={`/explorer/account/ban_1fundm3d7zritekc8bdt4oto5ut8begz6jnnt7n3tdxzjq3t46aiuse1h7gj`}
              className="btn btn-secondary btn-sm mb-1"
            >
              Fund Account 1
            </Link>{" "}
            <Link
              to={`/explorer/account/ban_3fundbxxzrzfy3k9jbnnq8d44uhu5sug9rkh135bzqncyy9dw91dcrjg67wf`}
              className="btn btn-secondary btn-sm mb-1"
            >
              Fund Account 2
            </Link>
          </p>
        </div>
      </div>
    );
  }

  render() {
    const { loading } = this.state;

    return <Fragment>{!loading && this.stats}</Fragment>;
  }
}
