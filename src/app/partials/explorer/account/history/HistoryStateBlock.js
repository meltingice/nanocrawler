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

  render() {
    const { block } = this.props;
    return (
      <tr>
        <td>
          State <span className="text-muted">{block.subtype}</span>
        </td>
        <td>
          <AccountLink account={this.transactionAccount()} />
        </td>
        <td>{accounting.formatNumber(block.amount, 6)} NANO</td>
        <td>
          <BlockLink hash={block.hash} short />
        </td>
      </tr>
    );
  }
}

export default injectClient(HistoryStateBlock);
