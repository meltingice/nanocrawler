import React from "react";
import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";
import OptionalField from "../../../OptionalField";
import HistoryEntry from "./HistoryEntry";
import { formatTimestamp } from "lib/util";
import { TranslatedMessage } from "lib/TranslatedMessage";

export default function HistoryChangeBlock({ block }) {
  return (
    <HistoryEntry
      type={
        <span className="text-info text-capitalize">
          <TranslatedMessage id="block.subtype.change" />
        </span>
      }
      account={
        <AccountLink
          account={block.representative}
          ninja
          className="text-dark break-word"
        />
      }
      amount={<i className="text-muted">N/A</i>}
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
