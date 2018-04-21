import React, { Fragment } from "react";
import moment from "moment";
import accounting from "accounting";
import NanoNodeNinja from "../../../../lib/NanoNodeNinja";

export default class NodeNinjaAccount extends React.Component {
  state = {
    data: null
  };

  componentDidMount() {
    this.fetchNinja();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.account !== this.props.account) {
      this.fetchNinja();
    }
  }

  async fetchNinja() {
    const { account } = this.props;
    const ninja = new NanoNodeNinja(account);
    await ninja.fetch();

    this.setState({ data: ninja.data });
  }

  render() {
    const { account } = this.props;
    const { data } = this.state;

    if (!data || !data.monitor) return null;

    return (
      <Fragment>
        <div className="row mt-5 align-items-center">
          <div className="col-sm">
            <h2 className="mb-0">{data.alias}</h2>
            <p className="text-muted mb-0">
              Verified by{" "}
              <a
                href={`https://nanonode.ninja/account/${account}`}
                className="text-muted"
                target="_blank"
              >
                Nano Node Ninja
              </a>
            </p>
          </div>
          <div className="col-auto">
            <a
              href={data.monitor.url}
              className="btn btn-nano-primary"
              target="_blank"
            >
              Open Node Monitor
            </a>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">Sync Status</p>
            <h2>{accounting.formatNumber(data.monitor.sync, 2)}%</h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">Uptime</p>
            <h2>{accounting.formatNumber(data.uptime, 2)}%</h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">Block Count</p>
            <h2>{accounting.formatNumber(data.monitor.blocks)}</h2>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">Last Voted</p>
            <h3>{moment(data.lastVoted).fromNow()}</h3>
          </div>
          <div className="col-sm text-sm-center">
            <p className="text-muted mb-2">Node Version</p>
            <h2>{data.monitor.version}</h2>
          </div>
        </div>
      </Fragment>
    );
  }
}
