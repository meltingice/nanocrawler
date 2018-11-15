import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import moment from "moment";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";
import Currency from "lib/Currency";

import AccountLink from "../partials/AccountLink";

import { apiClient } from "lib/Client";
import config from "client-config.json";

export default class NodeStatus extends React.PureComponent {
  constructor(props) {
    super(props);

    this.statTimer = null;
    this.state = {
      account: "",
      blockCount: {},
      version: {},
      weight: 0,
      peerCount: 0,
      systemInfo: {}
    };
  }

  async componentWillMount() {
    this.setState(
      {
        version: await apiClient.version(),
        account: await apiClient.nodeAccount()
      },
      () => this.updateStats()
    );
  }

  componentWillUnmount() {
    if (this.statTimer) {
      clearTimeout(this.statTimer);
      this.statTimer = null;
    }
  }

  async updateStats() {
    this.setState({
      blockCount: await apiClient.blockCount(),
      weight: await apiClient.weight(this.state.account),
      systemInfo: await apiClient.systemInfo(),
      peerCount: await apiClient.peerCount()
    });

    this.statTimer = setTimeout(this.updateStats.bind(this), 10000);
  }

  render() {
    const { blockCount, weight, peerCount } = this.state;

    return (
      <div className="p-4">
        <Helmet title="Node Status" />

        <div className="row align-items-center">
          <div className="col-sm">
            <h1 className="mb-0">
              <TranslatedMessage id="nav.status" />
            </h1>
            <p className="text-muted break-word">
              <AccountLink
                account={this.state.account}
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
            <p className="text-muted mb-2">
              <TranslatedMessage id="status.checked_blocks" />
            </p>
            <h2>
              <FormattedNumber
                value={blockCount.count || 0}
                maximumFractionDigits={0}
              />
            </h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <TranslatedMessage id="status.unchecked_blocks" />
            </p>
            <h2>
              <FormattedNumber
                value={blockCount.unchecked || 0}
                maximumFractionDigits={0}
              />
            </h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <TranslatedMessage id="status.voting_weight" />
            </p>
            <h2>
              <FormattedNumber
                value={Currency.fromRaw(weight)}
                maximumFractionDigits={0}
              />{" "}
              {config.currency.shortName}
            </h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <TranslatedMessage id="status.peers" />
            </p>
            <h2>
              <FormattedNumber value={peerCount} />
            </h2>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <TranslatedMessage id="status.uptime" />
            </p>
            <h2>{this.getUptime()}</h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <TranslatedMessage id="status.cpu_usage" />
            </p>
            <h2>{this.getCpuUsage()}</h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <TranslatedMessage id="status.memory" />
            </p>
            <h2>{this.getMemory()}</h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">
              <TranslatedMessage id="status.database" />
            </p>
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
        return `${Math.round((amt / 1024.0) * 100.0) / 100.0}GB`;
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
    return size > 1024 ? (
      <Fragment>
        <FormattedNumber value={size / 1024} maximumFractionDigits={2} />GB
      </Fragment>
    ) : (
      <Fragment>
        <FormattedNumber value={size} maximumFractionDigits={2} />MB
      </Fragment>
    );
  }
}
