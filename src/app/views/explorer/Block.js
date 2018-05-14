import React from "react";
import { Helmet } from "react-helmet";
import _ from "lodash";

import injectClient from "../../../lib/ClientComponent";

import OpenBlock from "../../partials/explorer/block/OpenBlock";
import SendBlock from "../../partials/explorer/block/SendBlock";
import ReceiveBlock from "../../partials/explorer/block/ReceiveBlock";
import ChangeBlock from "../../partials/explorer/block/ChangeBlock";
import StateBlock from "../../partials/explorer/block/StateBlock";

class Block extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      block: null
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.block !== this.props.match.params.block) {
      this.fetchData();
    }
  }

  async fetchData() {
    const { match } = this.props;
    const block = await this.props.client.block(match.params.block);
    this.setState({ block });
  }

  render() {
    const { match } = this.props;
    const { block } = this.state;

    if (!block) return null;

    return (
      <div className="p-4">
        <Helmet>
          <title>Block - {match.params.block}</title>
        </Helmet>

        <div className="row align-items-center">
          <div className="col">
            <h1 className="mb-0">{_.capitalize(block.contents.type)} Block</h1>
            <p className="text-muted break-word">{match.params.block}</p>
          </div>
        </div>

        <hr />

        <div className="mt-5">{this.getBlockForType()}</div>
      </div>
    );
  }

  getBlockForType() {
    const { block } = this.state;
    switch (block.contents.type) {
      case "open":
        return <OpenBlock block={block} />;
      case "send":
        return <SendBlock block={block} />;
      case "receive":
        return <ReceiveBlock block={block} />;
      case "change":
        return <ChangeBlock block={block} />;
      case "state":
        return <StateBlock block={block} />;
      default:
        return null;
    }
  }
}

export default injectClient(Block);
