import React from 'react'
import Client from '../../lib/Client'
import LargeStat from '../partials/LargeStat'

export default class NodeStatus extends React.Component {
  constructor(props) {
    super(props);

    this.statTimer = null;
    this.state = {
      blockCount: {}
    }
  }

  componentWillMount() {
    this.updateStats();
  }

  componentWillUnmount() {
    if (this.statTimer) {
      clearTimeout(this.statTimer);
      this.statTimer = null;
    }
  }

  async updateStats() {
    const client = new Client();
    this.setState({ blockCount: await client.blockCount() })

    this.statTimer = setTimeout(this.updateStats.bind(this), 10000);
  }

  render() {
    const { blockCount } = this.state;

    return (
      <div className="p-4">
        <div className="row">
          <div className="col">
            <h1>Node Status</h1>

            <hr />

            <div className="row">
              <div className="col">

              </div>
              <div className="col">
                <LargeStat value={blockCount.count} text="blocks in ledger" />
                <LargeStat value={blockCount.unchecked} text="blocks unchecked" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
