import React from "react";
import _ from "lodash";

import injectClient from "../../lib/ClientComponent";
import DelegatorsTable from "../partials/delegators/DelegatorsTable";

class Delegators extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      delegators: {}
    };

    this.timeout = null;
  }

  componentWillMount() {
    this.fetchDelegators();
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  async fetchDelegators() {
    this.setState({ delegators: await this.props.client.delegators() });
    this.timeout = setTimeout(this.fetchDelegators.bind(this), 300000);
  }

  render() {
    const { delegators } = this.state;
    const numDelegators = _.keys(delegators).length;

    return (
      <div className="p-4">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="mb-0">Delegators</h1>
            <p className="text-muted">Sorted by weight</p>
          </div>
          <div className="col col-auto">
            <h3>
              {numDelegators} delegator{numDelegators === 1 ? "" : "s"}
            </h3>
          </div>
        </div>

        <hr />

        <DelegatorsTable delegators={delegators} />
      </div>
    );
  }
}

export default injectClient(Delegators);
