import React from "react";
import { TranslatedMessage } from "lib/TranslatedMessage";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";
import PriceWithConversions from "../../PriceWithConversions";
import OptionalField from "../../OptionalField";
import { formatTimestamp } from "../../../../lib/util";

export default function SendBlock({ block }) {
  return (
    <div className="Block">
      <h4 className="mb-0">
        <TranslatedMessage id="block.sender" />{" "}
        <small>
          <AccountLink
            account={block.block_account}
            className="text-muted break-word"
            ninja
          />
        </small>
      </h4>
      <p>
        <small>
          <TranslatedMessage id="block.sender.desc" />
        </small>
      </p>

      <h4 className="mb-0">
        <TranslatedMessage id="block.recipient" />{" "}
        <small>
          <AccountLink
            account={block.contents.destination}
            className="text-muted break-word"
            ninja
          />
        </small>
      </h4>
      <p>
        <small>
          <TranslatedMessage id="block.recipient.desc" />
        </small>
      </p>

      <h4 className="mb-0">
        <TranslatedMessage id="amount" />{" "}
        <small className="text-muted">
          <PriceWithConversions
            amount={block.amount}
            currencies={["nano", "usd", "btc"]}
          />
        </small>
      </h4>
      <p>
        <small>
          <TranslatedMessage id="block.send.amount_desc" />
        </small>
      </p>

      <h4 className="mb-0">
        <span className="text-capitalize">
          <TranslatedMessage id="date" />
        </span>{" "}
        <small className="text-muted">
          <OptionalField value={formatTimestamp(block.timestamp)} />
        </small>
      </h4>
      <p>
        <small>
          <TranslatedMessage id="block.timestamp.desc" />
        </small>
      </p>

      <h5 className="mb-0">
        <TranslatedMessage id="block.previous" />{" "}
        <small>
          <BlockLink
            hash={block.contents.previous}
            className="text-muted break-word"
          />
        </small>
      </h5>
      <p>
        <small>
          <TranslatedMessage id="block.previous.desc" />
        </small>
      </p>

      <h5>
        <TranslatedMessage id="block.pow" />{" "}
        <small className="text-muted break-word">{block.contents.work}</small>
      </h5>
      <h5>
        <TranslatedMessage id="block.signature" />{" "}
        <small className="text-muted break-word">
          {block.contents.signature}
        </small>
      </h5>
    </div>
  );
}
