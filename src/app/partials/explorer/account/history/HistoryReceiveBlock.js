import React, { Fragment } from "react";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";

import HistoryEntry from "./HistoryEntry";
import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";
import OptionalField from "../../../OptionalField";
import { formatTimestamp } from "lib/util";
import Currency from "lib/Currency";
import config from "client-config.json";

export default function HistoryReceiveBlock({ block, intl }) {
  return (
    <HistoryEntry
      type={
        <span className="text-success text-capitalize">
          <TranslatedMessage id="block.subtype.receive" />
        </span>
      }
      account={
        <Fragment>
          <span className="text-muted">
            <TranslatedMessage id="block.from" />
          </span>{" "}
          <AccountLink
            account={block.account}
            className="text-dark break-word"
            ninja
          />
        </Fragment>
      }
      amount={
        <span className="text-success">
          +
          <FormattedNumber
            value={Currency.fromRaw(block.amount)}
            maximumFractionDigits={6}
            minimumFractionDigits={2}
          />{" "}
          {config.currency.shortName}
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
