import React from "react";
import { TranslatedMessage } from "lib/TranslatedMessage";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";
import PriceWithConversions from "../../PriceWithConversions";
import OptionalField from "../../OptionalField";
import { formatTimestamp } from "lib/util";

export default function OpenBlock({ block }) {
  return (
    <div className="Block">
      <h4 className="mb-0">
        <span className="text-capitalize">
          <TranslatedMessage id="account" />
        </span>{" "}
        <small>
          <AccountLink
            account={block.contents.account}
            className="text-muted break-word"
            ninja
          />
        </small>
      </h4>
      <p>
        <small>
          <TranslatedMessage id="block.open.desc" />
        </small>
      </p>

      <h4 className="mb-0">
        <TranslatedMessage id="block.open.opened_by" />{" "}
        <small>
          <AccountLink
            className="text-muted break-word"
            account={block.source_account}
            ninja
          />
        </small>
      </h4>
      <p>
        <small>
          <TranslatedMessage id="block.open.opened_by.desc" />
        </small>
      </p>

      <h4 className="mb-0">
        <span className="text-capitalize">
          <TranslatedMessage id="amount" />
        </span>{" "}
        <small className="text-muted">
          <PriceWithConversions
            amount={block.amount}
            currencies={["nano", "usd", "btc"]}
            precision={{ nano: 30, btc: 6, usd: 4 }}
          />
        </small>
      </h4>
      <p>
        <small>
          <TranslatedMessage id="block.open.amount_desc" />
        </small>
      </p>

      <h4 className="mb-0">
        <span className="text-capitalize">
          <TranslatedMessage id="representative" />
        </span>{" "}
        <small>
          <AccountLink
            className="text-muted break-word"
            account={block.contents.representative}
            ninja
          />
        </small>
      </h4>
      <p>
        <small>
          <TranslatedMessage id="block.open.rep" />
        </small>
      </p>

      <h4 className="mb-0">
        <span className="text-capitalize">
          <TranslatedMessage id="source" />
        </span>{" "}
        <small>
          <BlockLink
            hash={block.contents.source}
            className="text-muted break-word"
          />
        </small>
      </h4>
      <p>
        <small>
          <TranslatedMessage id="block.source.desc" />
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
