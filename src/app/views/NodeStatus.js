import React from 'react'
import Client from '../../lib/Client'
import LargeStat from '../partials/LargeStat'

export default class NodeStatus extends React.Component {
  constructor(props) {
    super(props);

    this.statTimer = null;
    this.state = {
      blockCount: {},
      version: {}
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
    this.setState({ blockCount: await this.client.blockCount() })
    this.statTimer = setTimeout(this.updateStats.bind(this), 10000);
  }

  render() {
    const { blockCount } = this.state;

    return (
      <div className="p-4">
        <div className="row">
          <div className="col">
            <div className="row align-items-center">
              <div className="col">
                <h1>Node Status</h1>
              </div>
              <div className="col col-auto">
                <h3>Version: {this.state.version.node_vendor}</h3>
              </div>
            </div>

            <hr />

            <LargeStat value={blockCount.count} text="blocks in ledger" />
            <LargeStat value={blockCount.unchecked} text="blocks unchecked" />
          </div>
        </div>
      </div>
    )
  }
}
