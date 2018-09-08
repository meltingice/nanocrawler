import React, { Fragment } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import _ from "lodash";
import accounting from "accounting";
import DelegatorsTable from "./DelegatorsTable";

import injectClient from "../../../../lib/ClientComponent";

import LoadingState from "./delegators/LoadingState";
import EmptyState from "./delegators/EmptyState";

class AccountDelegators extends React.Component {
  state = {
    delegators: [],
    weight: 0,
    loading: true
  };

  constructor(props) {
    super(props);
  }

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

    const delegators = await this.props.client.delegators(account);

    if (_.keys(delegators).length > 0) {
      weight = await this.props.client.weight(account);
    }

    this.setState({ delegators, weight, loading: false });
  }

  get delegatorsCount() {
    return _.keys(this.state.delegators).length;
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
              <FormattedMessage id="account.delegators.title" />
            </h2>
            <p className="text-muted mb-0">
              <FormattedMessage
                id="account.delegators.desc"
                values={{
                  count: <FormattedNumber value={this.delegatorsCount} />
                }}
              />
            </p>
            <p className="text-muted">
              <FormattedMessage id="account.delegators.filter" />
            </p>
          </div>
          <div className="col-auto">
            <h3 className="mb-0">
              <FormattedNumber value={weight} />{" "}
              <span className="text-muted">
                NANO <FormattedMessage id="weight" />
              </span>
            </h3>
          </div>
        </div>
        <DelegatorsTable delegators={delegators} />
      </div>
    );
  }
}

export default injectClient(AccountDelegators);
