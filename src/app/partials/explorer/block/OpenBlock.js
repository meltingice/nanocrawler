import React from "react";
import { FormattedMessage } from "react-intl";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";
import PriceWithConversions from "../../PriceWithConversions";
import OptionalField from "../../OptionalField";
import { formatTimestamp } from "../../../../lib/util";

export default function OpenBlock({ block }) {
  return (
    <div className="Block">
      <h4 className="mb-0">
        <span className="text-capitalize">
          <FormattedMessage id="account" />
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
          <FormattedMessage id="block.open.desc" />
        </small>
      </p>

      <h4 className="mb-0">
        <FormattedMessage id="block.open.opened_by" />{" "}
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
          <FormattedMessage id="block.open.opened_by.desc" />
        </small>
      </p>

      <h4 className="mb-0">
        <span className="text-capitalize">
          <FormattedMessage id="amount" />
        </span>{" "}
        <small className="text-muted">
          <PriceWithConversions
            amount={block.amount}
            currencies={["nano", "usd", "btc"]}
          />
        </small>
      </h4>
      <p>
        <small>
          <FormattedMessage id="block.amount_desc" />
        </small>
      </p>

      <h4 className="mb-0">
        <span className="text-capitalize">
          <FormattedMessage id="representative" />
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
          <FormattedMessage id="block.open.rep" />
        </small>
      </p>

      <h4 className="mb-0">
        <span className="text-capitalize">
          <FormattedMessage id="source" />
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
          <FormattedMessage id="block.source.desc" />
        </small>
      </p>

      <h4 className="mb-0">
        <span className="text-capitalize">
          <FormattedMessage id="date" />
        </span>{" "}
        <small className="text-muted">
          <OptionalField value={formatTimestamp(block.timestamp)} />
        </small>
      </h4>
      <p>
        <small>
          <FormattedMessage id="block.timestamp.desc" />
        </small>
      </p>

      <h5>
        <FormattedMessage id="block.pow" />{" "}
        <small className="text-muted break-word">{block.contents.work}</small>
      </h5>

      <h5>
        <FormattedMessage id="block.signature" />{" "}
        <small className="text-muted break-word">
          {block.contents.signature}
        </small>
      </h5>
    </div>
  );
}
