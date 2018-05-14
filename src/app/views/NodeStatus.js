import React from "react";
import { Helmet } from "react-helmet";
import accounting from "accounting";
import moment from "moment";

import injectClient from "../../lib/ClientComponent";

import AccountLink from "../partials/AccountLink";

class NodeStatus extends React.Component {
  constructor(props) {
    super(props);

    this.statTimer = null;
    this.state = {
      blockCount: {},
      version: {},
      weight: 0,
      peerCount: 0,
      systemInfo: {}
    };
  }

  async componentWillMount() {
    this.setState({ version: await this.props.client.version() });
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
      blockCount: await this.props.client.blockCount(),
      weight: await this.props.client.weight(this.props.account),
      systemInfo: await this.props.client.systemInfo(),
      peerCount: await this.props.client.peerCount()
    });

    this.statTimer = setTimeout(this.updateStats.bind(this), 10000);
  }

  render() {
    const { blockCount, weight, peerCount } = this.state;

    return (
      <div className="p-4">
        <Helmet>
          <title>Node Status</title>
        </Helmet>

        <div className="row align-items-center">
          <div className="col-sm">
            <h1 className="mb-0">Node Status</h1>
            <p className="text-muted break-word">
              <AccountLink
                account={this.props.account}
                className="text-muted"
              />
            </p>
          </div>
          <div className="col col-auto">
            <h3>
              <span className="text-muted">Version</span>{" "}
              {this.state.version.node_vendor}
            </h3>
          </div>
        </div>

        <hr />

        <div className="row mt-5">
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">Blocks in Ledger</p>
            <h2>{accounting.formatNumber(blockCount.count)}</h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">Unchecked Blocks</p>
            <h2>{accounting.formatNumber(blockCount.unchecked)}</h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">Voting Weight</p>
            <h2>{accounting.formatNumber(weight)} NANO</h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">Peers</p>
            <h2>{accounting.formatNumber(peerCount)}</h2>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">Uptime</p>
            <h2>{this.getUptime()}</h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">CPU Usage</p>
            <h2>{this.getCpuUsage()}</h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              Memory <small className="text-muted">(used / total)</small>
            </p>
            <h2>{this.getMemory()}</h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">Database Size</p>
            <h2>{this.getDatabaseSize()}</h2>
          </div>
        </div>
      </div>
    );
  }

  getUptime() {
    const { systemInfo } = this.state;
    if (!systemInfo.raiStats) return "...";
    return moment()
      .subtract((systemInfo.raiStats.elapsed || 0) / 1000, "seconds")
      .fromNow(true);
  }

  getCpuUsage() {
    const { systemInfo } = this.state;
    if (!systemInfo.raiStats) return "...";
    return `${systemInfo.raiStats.cpu || 0}%`;
  }

  getMemory() {
    const { systemInfo } = this.state;
    if (!systemInfo.memory) return "...";
    const { memory, raiStats } = systemInfo;

    const formatMemory = amt => {
      amt = amt / 1024 / 1024;
      if (amt > 1024) {
        return `${Math.round(amt / 1024.0 * 100.0) / 100.0}GB`;
      }

      return `${Math.round(amt * 100.0) / 100.0}MB`;
    };

    return `${formatMemory(raiStats.memory || 0)} / ${formatMemory(
      memory.total
    )}`;
  }

  getDatabaseSize() {
    const { systemInfo } = this.state;
    if (!systemInfo.dbSize) return "Unknown";
    let size = systemInfo.dbSize / 1024.0 / 1024.0;
    return size > 1024
      ? `${accounting.formatNumber(size / 1024, 2)}GB`
      : `${accounting.formatNumber(size, 2)}MB`;
  }
}

export default injectClient(NodeStatus);
