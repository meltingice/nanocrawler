import React, { Fragment } from "react";
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
      events: []
    };

    this.websocket = new AccountWebsocket();
  }

  async componentDidMount() {
    try {
      await this.websocket.connect();
      this.websocket.subscribeAll(this.onWebsocketEvent.bind(this));
    } catch (e) {
      console.log(e.message);
    }
  }

  componentWillUnmount() {
    this.websocket.disconnect();
  }

  onWebsocketEvent(event) {
    let { events } = this.state;
    events.unshift(event);
    this.setState({ events: events.slice(0, this.props.count) });
  }

  render() {
    return (
      <Fragment>
        <h3 className="mb-0">Recent Transactions</h3>
        <p className="text-muted">
          A real-time stream of transactions on the Nano network
        </p>

        <hr />

        {this.getEvents()}
      </Fragment>
    );
  }

  getEvents() {
    const { events } = this.state;
    if (events.length === 0) return this.emptyState();
    return events.map(event => <RecentBlock key={event.hash} event={event} />);
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
