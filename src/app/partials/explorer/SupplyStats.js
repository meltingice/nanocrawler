import React, { Fragment } from "react";
import { FormattedNumber } from "react-intl";
import { Link } from "react-router-dom";
import { apiClient } from "lib/Client";
import Currency from "lib/Currency";
import config from "client-config.json";

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
    const { circulating, available } = this.state;

    return (
      <div className="row">
        <div className="col-lg">
          <h4 className="mb-0">
            <FormattedNumber
              value={Currency.fromCents(available)}
              maximumFractionDigits={2}
              minimumFractionDigits={2}
            />{" "}
            USD <span className="text-muted">available supply</span>
          </h4>
          <p className="text-muted">
            The total amount of NOLLAR that is backed 1:1 to US Dollars
          </p>
          <p>
            <Link
              to={`/explorer/account/${config.currency.genesisAccount}`}
              className="btn btn-secondary btn-sm"
            >
              View Genesis Account
            </Link>
          </p>
        </div>
        <div className="col-lg">
          <h4 className="mb-0">
            <FormattedNumber
              value={Currency.fromCents(circulating)}
              maximumFractionDigits={2}
              minimumFractionDigits={2}
            />{" "}
            USD <span className="text-muted">circulating supply</span>
          </h4>
          <p className="text-muted">
            The amount of NOLLAR that is publicly circulating and has left the
            emission account
          </p>
          <p>
            <Link
              to={`/explorer/account/${config.currency.emissionAccount}`}
              className="btn btn-secondary btn-sm"
            >
              View Emission Account
            </Link>
          </p>
        </div>
      </div>
    );
  }

  render() {
    const { loading } = this.state;

    return (
      <Fragment>
        <h3 className="mb-0">NOLLAR Circulation</h3>
        <p className="text-muted">
          The amount of NOLLAR currently in circulation, updated in realtime
        </p>

        <hr />

        {!loading && this.stats}
      </Fragment>
    );
  }
}
