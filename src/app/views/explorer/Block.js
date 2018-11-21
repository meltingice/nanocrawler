import React from "react";
import { TranslatedMessage } from "lib/TranslatedMessage";
import { Helmet } from "react-helmet";

import OpenBlock from "../../partials/explorer/block/OpenBlock";
import SendBlock from "../../partials/explorer/block/SendBlock";
import ReceiveBlock from "../../partials/explorer/block/ReceiveBlock";
import ChangeBlock from "../../partials/explorer/block/ChangeBlock";
import StateBlock from "../../partials/explorer/block/StateBlock";
import NotFoundBlock from "../../partials/explorer/block/NotFoundBlock";

import { apiClient } from "lib/Client";

export default class Block extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      block: null,
      failed: false
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

    try {
      const block = await apiClient.block(match.params.block);
      this.setState({ block });
    } catch (e) {
      this.setState({ failed: true });
    }
  }

  get blockType() {
    const { block } = this.state;
    if (block.contents.type === "state") {
      return <TranslatedMessage id="block.state" />;
    }

    return <TranslatedMessage id={`block.subtype.${block.contents.type}`} />;
  }

  render() {
    const { match } = this.props;
    const { block, failed } = this.state;

    if (failed) return <NotFoundBlock block={match.params.block} />;
    if (!block) return null;

    return (
      <div className="p-4">
        <Helmet title={`Block - ${match.params.block}`} />

        <div className="row align-items-center">
          <div className="col">
            <h1 className="mb-0">
              <span className="text-capitalize">{this.blockType}</span>{" "}
              <span className="text-capitalize">
                <TranslatedMessage id="block" />
              </span>
            </h1>
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
