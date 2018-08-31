import React, { Fragment } from "react";
import moment from "moment";
import accounting from "accounting";
import NanoNodeNinja from "../../../../lib/NanoNodeNinja";

export default class NodeNinjaAccount extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.data && prevState.data.account !== nextProps.account) {
      return { data: null };
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      data: null
    };

    this.timeout = null;
  }

  componentDidMount() {
    this.fetchNinja();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.account !== this.props.account) {
      this.clearTimeout();
      this.fetchNinja();
    }
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  clearTimeout() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  async fetchNinja() {
    const { account } = this.props;
    const ninja = new NanoNodeNinja(account);
    await ninja.fetch();

    if (ninja.hasAccount()) {
      this.setState({ data: ninja.data });
      this.timeout = setTimeout(this.fetchNinja.bind(this), 60000);
    }
  }

  render() {
    const { account } = this.props;
    const { data } = this.state;

    if (!data || !data.alias) return null;

    return (
      <div className="row mt-5">
        <div className="col-sm text-sm-right">
          <h2 className="mb-0">{data.alias}</h2>
          <p className="text-muted">
            Verified by{" "}
            <a
              href={`https://mynano.ninja/account/${account}`}
              className="text-muted"
              target="_blank"
            >
              Nano Node Ninja
            </a>
          </p>

          {this.getNodeMonitorLink()}
        </div>
        <div className="col-sm mt-3 mt-sm-0">
          <h4>
            Uptime{" "}
            <small className="text-muted">
              {accounting.formatNumber(data.uptime, 2)}%
            </small>
          </h4>
          <h4>
            Last voted{" "}
            <small className="text-muted">
              {moment(data.lastVoted).fromNow()}
            </small>
          </h4>

          {this.getMonitorStatus()}
        </div>
      </div>
    );
  }

  getNodeMonitorLink() {
    const { data } = this.state;
    if (!data || !data.monitor) return null;

    return (
      <a
        href={data.monitor.url}
        className="btn btn-nano-primary"
        target="_blank"
      >
        Open Node Monitor
      </a>
    );
  }

  getMonitorStatus() {
    const { data } = this.state;
    if (!data || !data.monitor) return null;

    return (
      <Fragment>
        <h4>
          Sync status{" "}
          <small className="text-muted">
            {accounting.formatNumber(data.monitor.sync, 2)}%
          </small>
        </h4>
        <h4>
          Block count{" "}
          <small className="text-muted">
            {accounting.formatNumber(data.monitor.blocks)}
          </small>
        </h4>

        <h4>
          Node version{" "}
          <small className="text-muted">{data.monitor.version}</small>
        </h4>
      </Fragment>
    );
  }
}
