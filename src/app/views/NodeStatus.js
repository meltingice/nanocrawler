import React from 'react'
import accounting from 'accounting'

import Client from '../../lib/Client'

export default class NodeStatus extends React.Component {
  constructor(props) {
    super(props);

    this.statTimer = null;
    this.state = {
      blockCount: {},
      version: {},
      delegatorsCount: 0
    }

    this.client = new Client();
  }

  async componentWillMount() {
    this.setState({ version: await this.client.version() });
    this.updateStats();
  }

  componentWillUnmount() {
    if (this.statTimer) {
      clearTimeout(this.statTimer);
      this.statTimer = null;
    }
  }

  async updateStats() {
    this.setState({
      blockCount: await this.client.blockCount(),
      delegatorsCount: await this.client.delegatorsCount()
    })

    this.statTimer = setTimeout(this.updateStats.bind(this), 10000);
  }

  render() {
    const { blockCount, delegatorsCount } = this.state;

    return (
      <div className="p-4">
        <div className="row">
          <div className="col">
            <div className="row align-items-center">
              <div className="col">
                <h1>Node Status</h1>
              </div>
              <div className="col col-auto">
                <h3><span className="text-muted">Version</span> {this.state.version.node_vendor}</h3>
              </div>
            </div>

            <hr />

            <div className="row mt-5">
              <div className="col text-sm-center">
                <p className="text-muted mb-0">Blocks in Ledger</p>
                <h2>{accounting.formatNumber(blockCount.count)}</h2>
              </div>
              <div className="col text-sm-center">
                <p className="text-muted mb-0">Unchecked Blocks</p>
                <h2>{accounting.formatNumber(blockCount.unchecked)}</h2>
              </div>
              <div className="col text-sm-center">
                <p className="text-muted mb-0">Delegators</p>
                <h2>{delegatorsCount}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
