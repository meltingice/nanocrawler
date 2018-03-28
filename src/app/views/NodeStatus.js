import React from 'react'
import accounting from 'accounting'
import moment from 'moment'

import Client from '../../lib/Client'

export default class NodeStatus extends React.Component {
  constructor(props) {
    super(props);

    this.statTimer = null;
    this.state = {
      blockCount: {},
      version: {},
      delegatorsCount: 0,
      systemInfo: {}
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
      delegatorsCount: await this.client.delegatorsCount(),
      systemInfo: await this.client.systemInfo()
    })

    this.statTimer = setTimeout(this.updateStats.bind(this), 10000);
  }

  render() {
    const { blockCount, delegatorsCount } = this.state;

    return (
      <div className="p-4">
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

        <div className="row mt-3">
          <div className="col text-sm-center">
            <p className="text-muted mb-0">Uptime</p>
            <h2>{this.getUptime()}</h2>
          </div>
          <div className="col text-sm-center">
            <p className="text-muted mb-0">Load Average</p>
            <h2>{this.getLoadAverage()}</h2>
          </div>
          <div className="col text-sm-center">
            <p className="text-muted mb-0">Memory <small className="text-muted">(used / total)</small></p>
            <h2>{this.getMemory()}</h2>
          </div>
        </div>
      </div>
    )
  }

  getUptime() {
    const { systemInfo } = this.state;
    if (!systemInfo.uptime) return "...";
    return moment().subtract(systemInfo.uptime, 'seconds').fromNow(true);
  }

  getLoadAverage() {
    const { systemInfo } = this.state;
    if (!systemInfo.loadAvg) return "...";
    return systemInfo.loadAvg
      .map(avg => Math.round(avg * 100.0) / 100.0)
      .join(', ');
  }

  getMemory() {
    const { systemInfo } = this.state;
    if (!systemInfo.memory) return "...";
    const { memory } = systemInfo;

    const formatMemory = (amt) => {
      amt = amt / 1024 / 1024;
      if (amt > 1024) {
        return `${Math.round(amt / 1024.0 * 100.0) / 100.0}GB`;
      }

      return `${Math.round(amt * 100.0) / 100.0}MB`
    }

    return `${formatMemory(memory.total - memory.free)} / ${formatMemory(memory.total)}`
  }
}
