import React, { Fragment } from "react";
import _ from "lodash";
import accounting from "accounting";
import DelegatorsTable from "./DelegatorsTable";

import injectClient from "../../../../lib/ClientComponent";

class AccountDelegators extends React.Component {
  state = {
    delegators: [],
    weight: 0
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetchDelegators();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.account != this.props.account) {
      this.fetchDelegators();
    }
  }

  async fetchDelegators() {
    const { account } = this.props;

    const delegators = await this.props.client.delegators(account);
    this.setState({ delegators });
  }

  render() {
    const { delegators } = this.state;
    const { weight } = this.props;

    if (_.values(delegators).filter(amt => parseInt(amt, 10) > 1).length === 0)
      return null;

    return (
      <div className="mt-5">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="mb-0">Delegators</h2>
            <p className="text-muted mb-0">
              {_.keys(delegators).length} delegators, sorted by weight
            </p>
            <p className="text-muted">
              Only showing accounts with at least 1 NANO
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
}

export default injectClient(AccountDelegators);
