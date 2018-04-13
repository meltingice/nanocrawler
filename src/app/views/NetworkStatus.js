import React from "react";
import _ from "lodash";
import injectClient from "../../lib/ClientComponent";

import BlockByTypeStats from "../partials/BlockByTypeStats";
import PeerVersions from "../partials/PeerVersions";

class NetworkStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      blocksByType: {},
      peers: {}
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
      blocksByType: await this.props.client.blockCountByType(),
      peers: await this.props.client.peers()
    });
  }

  render() {
    return (
      <div className="p-4">
        <div className="row align-items-center">
          <div className="col-md">
            <h1>Network Status</h1>
          </div>
        </div>

        <hr />

        <div className="row mt-5">
          <div className="col-md">
            <h2>Block Stats</h2>
            {this.getBlocksByType()}
          </div>
          <div className="col-md mt-3 mt-md-0">
            <PeerVersions peers={this.state.peers} />
          </div>
        </div>
      </div>
    );
  }

  getBlocksByType() {
    const { blocksByType } = this.state;

    return _.map(blocksByType, (count, type) => {
      return <BlockByTypeStats key={type} type={type} count={count} />;
    });
  }
}

export default injectClient(NetworkStatus);
