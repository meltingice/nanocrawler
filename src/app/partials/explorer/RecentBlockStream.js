import React, { Fragment } from "react";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";
import { CSSTransitionGroup } from "react-transition-group";
import AccountWebsocket from "lib/AccountWebsocket";

import { apiClient } from "lib/Client";
import config from "client-config.json";

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
      throughput: 0
    };

    this.websocket = new AccountWebsocket(config.websocketServer);
    this.tpsInterval = null;
  }

  async componentDidMount() {
    try {
      await this.websocket.connect();
      this.websocket.subscribeAll(this.onWebsocketEvent.bind(this));

      this.calculateThroughput();
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
    let { events } = this.state;
    events.unshift(event);
    this.setState({ events: events.slice(0, this.props.count) });
  }

  async calculateThroughput() {
    const tps = await apiClient.networkTps("1m");
    this.setState({ throughput: tps });
  }

  render() {
    const { throughput } = this.state;

    if (!config.websocketServer) return null;

    return (
      <Fragment>
        <div className="row align-items-center">
          <div className="col-sm">
            <h3 className="mb-0">
              <TranslatedMessage id="stream.title" />
            </h3>
            <p className="text-muted mb-0">
              <TranslatedMessage
                id="stream.desc"
                values={{ currency: config.currency.name }}
              />
            </p>
          </div>
          <div className="col-auto">
            <h5 className="mb-0">
              <FormattedNumber value={throughput} maximumFractionDigits={2} />{" "}
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
      <CSSTransitionGroup
        transitionName="Transaction"
        transitionEnterTimeout={500}
        transitionLeave={false}
      >
        {events.map(event => (
          <RecentBlock key={event.hash} event={event} />
        ))}
      </CSSTransitionGroup>
    );
  }

  emptyState() {
    return (
      <div className="my-5 text-center">
        <h5 className="text-muted">
          <TranslatedMessage id="stream.waiting" />
        </h5>
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
