import React from 'react'


import LargeStat from '../partials/LargeStat'

export default class Synchronization extends React.Component {
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
    // const blockCount = await RaiBlocks.blockCount();
    // this.setState({ blockCount });

    this.statTimer = setTimeout(this.updateStats.bind(this), 2000);
  }

  render() {
    const { blockCount } = this.state;

    return (
      <div className="p-4">
        <div className="row">
          <div className="col">
            <h1>Synchronization</h1>

            <hr />

            <LargeStat value={blockCount.count} text="blocks in ledger" />
            <LargeStat value={blockCount.unchecked} text="blocks synchronizing" />
          </div>
        </div>
      </div>
    )
  }
}
