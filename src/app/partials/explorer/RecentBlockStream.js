import React, { Fragment } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import accounting from "accounting";
import AccountWebsocket from "../../../lib/AccountWebsocket";

import ChangeBlock from "./stream/ChangeBlock";
import OpenBlock from "./stream/OpenBlock";
import ReceiveBlock from "./stream/ReceiveBlock";
import SendBlock from "./stream/SendBlock";
import StateBlock from "./stream/StateBlock";

export default class RecentBlockStream extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      throughput: 0,
      tpsCount: 0
    };

    this.websocket = new AccountWebsocket();
    this.tpsInterval = null;
  }

  async componentDidMount() {
    try {
      await this.websocket.connect();
      this.websocket.subscribeAll(this.onWebsocketEvent.bind(this));
      this.tpsInterval = setInterval(
        this.calculateThroughput.bind(this),
        10000
      );
    } catch (e) {
      console.log(e.message);
    }
  }

  componentWillUnmount() {
    if (this.tpsInterval) clearInterval(this.tpsInterval);
    this.websocket.disconnect();
  }

  onWebsocketEvent(event) {
    let { events, tpsCount } = this.state;
    events.unshift(event);
    tpsCount++;
    this.setState({ tpsCount, events: events.slice(0, this.props.count) });
  }

  calculateThroughput() {
    const { tpsCount } = this.state;
    this.setState({ throughput: tpsCount / 10.0, tpsCount: 0 });
  }

  render() {
    const { throughput } = this.state;

    return (
      <Fragment>
        <div className="row align-items-center">
          <div className="col-sm">
            <h3 className="mb-0">Recent Transactions</h3>
            <p className="text-muted mb-0">
              A real-time stream of transactions on the Nano network
            </p>
          </div>
          <div className="col-auto">
            <h5 className="mb-0">
              {accounting.formatNumber(throughput, 1)}{" "}
              <span className="text-muted">tx / sec</span>
            </h5>
          </div>
        </div>

        <hr />

        {this.getEvents()}
      </Fragment>
    );
  }

  getEvents() {
    const { events } = this.state;
    if (events.length === 0) return this.emptyState();
    return (
      <ReactCSSTransitionGroup
        transitionName="Transaction"
        transitionEnterTimeout={500}
        transitionLeave={false}
      >
        {events.map(event => <RecentBlock key={event.hash} event={event} />)}
      </ReactCSSTransitionGroup>
    );
  }

  emptyState() {
    return (
      <div className="my-5 text-center">
        <h5 className="text-muted">Waiting for transactions...</h5>
      </div>
    );
  }
}

const RecentBlock = ({ event }) => {
  let block;
  switch (event.block.type) {
    case "change":
      block = <ChangeBlock event={event} />;
      break;
    case "open":
      block = <OpenBlock event={event} />;
      break;
    case "receive":
      block = <ReceiveBlock event={event} />;
      break;
    case "send":
      block = <SendBlock event={event} />;
      break;
    case "state":
      block = <StateBlock event={event} />;
      break;
  }

  return (
    <Fragment>
      {block} <hr />
    </Fragment>
  );
};
