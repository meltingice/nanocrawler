import React from "react";
import accounting from "accounting";

import injectClient from "../../../../../lib/ClientComponent";
import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";
import { keyToPublicAccountId } from "../../../../../lib/util";

class HistoryStateBlock extends React.Component {
  state = {
    sendBlock: null
  };

  componentDidMount() {
    this.fetchSendBlock();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.block.hash !== this.props.block.hash) {
      this.fetchSendBlock();
    }
  }

  async fetchSendBlock() {
    if (!["receive", "open"].includes(this.props.block.subtype)) return;

    const { block } = this.props;
    const sendBlock = await this.props.client.block(block.link);
    this.setState({ sendBlock });
  }

  transactionAccount() {
    const { block } = this.props;
    switch (block.subtype) {
      case "receive":
      case "open":
        const { sendBlock } = this.state;
        return sendBlock ? sendBlock.block_account : null;
      case "send":
        return keyToPublicAccountId(block.link);
      case "change":
        return block.representative;
    }
  }

  statusClass() {
    const { block } = this.props;
    switch (block.subtype) {
      case "receive":
      case "open":
        return "text-success";
      case "send":
        return "text-danger";
      case "change":
        return "text-info";
      default:
        return "text-dark";
    }
  }

  transactionSymbol() {
    const { block } = this.props;
    switch (block.subtype) {
      case "receive":
      case "open":
        return "+";
      case "send":
        return "-";
      default:
        return "";
    }
  }

  render() {
    const { block } = this.props;
    return (
      <tr>
        <td>
          State <span className={this.statusClass()}>{block.subtype}</span>
        </td>
        <td>
          <AccountLink
            account={this.transactionAccount()}
            ninja={block.subtype === "change"}
            className="text-dark"
          />
        </td>
        <td className={this.statusClass()}>
          {this.transactionSymbol()}
          {accounting.formatNumber(block.amount, 6)} NANO
        </td>
        <td>
          <BlockLink hash={block.hash} short className="text-muted" />
        </td>
      </tr>
    );
  }
}

export default injectClient(HistoryStateBlock);
