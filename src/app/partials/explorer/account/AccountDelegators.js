import React from "react";
import keys from "lodash/keys";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";
import Currency from "lib/Currency";
import DelegatorsTable from "./DelegatorsTable";
import { apiClient } from "lib/Client";
import config from "client-config.json";

import LoadingState from "./delegators/LoadingState";
import EmptyState from "./delegators/EmptyState";

export default class AccountDelegators extends React.Component {
  state = {
    delegators: [],
    weight: "0",
    loading: true
  };

  componentDidMount() {
    this.fetchDelegators();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.account != this.props.account) {
      this.setState({ loading: true });
      this.fetchDelegators();
    }
  }

  async fetchDelegators() {
    let weight;
    const { account } = this.props;

    const delegators = await apiClient.delegators(account);

    if (keys(delegators).length > 0) {
      weight = await apiClient.weight(account);
    }

    this.setState({ delegators, weight, loading: false });
  }

  get delegatorsCount() {
    return keys(this.state.delegators).length;
  }

  render() {
    const { delegators, loading, state, weight } = this.state;

    if (loading) return <LoadingState />;
    if (this.delegatorsCount === 0) return <EmptyState />;

    return (
      <div className="mt-5">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="mb-0">
              <TranslatedMessage id="account.delegators.title" />
            </h2>
            <p className="text-muted mb-0">
              <TranslatedMessage
                id="account.delegators.desc"
                values={{
                  count: <FormattedNumber value={this.delegatorsCount} />
                }}
              />
            </p>
            <p className="text-muted">
              <TranslatedMessage
                id="account.delegators.filter"
                values={{ currencyShortName: config.currency.shortName }}
              />
            </p>
          </div>
          <div className="col-auto">
            <h3 className="mb-0">
              <FormattedNumber value={Currency.fromRaw(weight)} />{" "}
              <span className="text-muted">
                {config.currency.shortName} <TranslatedMessage id="weight" />
              </span>
            </h3>
          </div>
        </div>
        <DelegatorsTable delegators={delegators} />
      </div>
    );
  }
}
