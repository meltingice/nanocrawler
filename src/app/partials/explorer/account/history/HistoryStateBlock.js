import React, { Fragment } from "react";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";

import HistoryEntry from "./HistoryEntry";
import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";
import { formatTimestamp } from "lib/util";
import OptionalField from "../../../OptionalField";
import { apiClient } from "lib/Client";
import Currency from "lib/Currency";
import config from "client-config.json";

export default class HistoryStateBlock extends React.PureComponent {
  transactionAccount() {
    const { block } = this.props;
    switch (block.subtype) {
      case "receive":
      case "open":
      case "send":
        return block.account;
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
      <HistoryEntry
        type={
          <Fragment>
            <TranslatedMessage id="block.state" />{" "}
            <span className={this.statusClass()}>
              <TranslatedMessage id={`block.subtype.${block.subtype}`} />
            </span>
          </Fragment>
        }
        account={
          <Fragment>
            <span className="text-muted">{this.accountAction()}</span>{" "}
            <AccountLink
              account={this.transactionAccount()}
              ninja
              className="text-dark break-word"
            />
          </Fragment>
        }
        amount={
          <span className={this.statusClass()}>
            {this.transactionSymbol()}
            {block.amount ? (
              <Fragment>
                <FormattedNumber
                  value={Currency.fromRaw(block.amount)}
                  minimumFractionDigits={2}
                  maximumFractionDigits={6}
                />{" "}
                {config.currency.shortName}
              </Fragment>
            ) : (
              "N/A"
            )}
          </span>
        }
        date={
          <OptionalField
            value={formatTimestamp(block.timestamp, block.local_timestamp)}
          />
        }
        block={
          <div className="text-truncate">
            <small>
              <BlockLink hash={block.hash} className="text-muted" />
            </small>
          </div>
        }
      />
    );
  }
}
