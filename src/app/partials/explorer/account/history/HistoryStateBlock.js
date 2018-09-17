import React from "react";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";

import injectClient from "../../../../../lib/ClientComponent";
import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";
import { keyToPublicAccountId, formatTimestamp } from "../../../../../lib/util";
import OptionalField from "../../../OptionalField";

class HistoryStateBlock extends React.PureComponent {
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

  accountAction() {
    const { block } = this.props;
    switch (block.subtype) {
      case "open":
      case "receive":
        return <TranslatedMessage id="block.from" />;
      case "send":
        return <TranslatedMessage id="block.to" />;
      default:
        return "";
    }
  }

  render() {
    const { block } = this.props;
    return (
      <tr>
        <td>
          <TranslatedMessage id="block.state" />{" "}
          <span className={this.statusClass()}>
            <TranslatedMessage id={`block.subtype.${block.subtype}`} />
          </span>
        </td>
        <td>
          <span className="text-muted">{this.accountAction()}</span>{" "}
          <AccountLink
            account={this.transactionAccount()}
            ninja={block.subtype === "change"}
            className="text-dark"
          />
        </td>
        <td className={this.statusClass()}>
          {this.transactionSymbol()}
          <FormattedNumber
            value={block.amount || 0}
            minimumFractionDigits={6}
            maximumFractionDigits={6}
          />{" "}
          NANO
        </td>
        <td>
          <OptionalField value={formatTimestamp(block.timestamp)} />
        </td>
        <td>
          <BlockLink hash={block.hash} short className="text-muted" />
        </td>
      </tr>
    );
  }
}

export default injectClient(HistoryStateBlock);
