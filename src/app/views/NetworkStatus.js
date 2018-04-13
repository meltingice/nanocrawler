import React from "react";
import _ from "lodash";
import accounting from "accounting";
import injectClient from "../../lib/ClientComponent";

import BlockByTypeStats from "../partials/BlockByTypeStats";

class NetworkStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      blocksByType: {}
    };

    this.statTimer = null;
  }

  componentWillMount() {
    this.updateStats();
    this.statTimer = setTimeout(this.updateStats.bind(this), 10000);
  }

  componentWillUnmount() {
    if (this.statTimer) clearTimeout(this.statTimer);
  }

  async updateStats() {
    this.setState({
      blocksByType: await this.props.client.blockCountByType()
    });
  }

  render() {
    return (
      <div className="p-4">
        <div className="row align-items-center">
          <div className="col-sm">
            <h1>Network Status</h1>
          </div>
        </div>

        <hr />

        <div className="row mt-5">{this.getBlocksByType()}</div>
      </div>
    );
  }

  getBlocksByType() {
    const { blocksByType } = this.state;

    return _.map(blocksByType, (count, type) => {
      return <BlockByTypeStats type={type} count={count} />;
    });
  }
}

export default injectClient(NetworkStatus);
