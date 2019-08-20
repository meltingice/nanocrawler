import React from "react";
import { TranslatedMessage } from "lib/TranslatedMessage";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";
import PriceWithConversions from "../../PriceWithConversions";
import OptionalField from "../../OptionalField";
import RawBlockContents from "./RawBlockContents";
import { formatTimestamp } from "lib/util";
import config from "client-config.json";

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
            raw
            amount={block.amount}
            currencies={["base", "usd", "btc"]}
            precision={{ base: 20, btc: 6, usd: 4 }}
          />
        </small>
      </h4>
      <p className="text-muted mb-0">
        <small>{block.amount} raw</small>
      </p>
      <p>
        <small>
          <TranslatedMessage
            id="block.open.amount_desc"
            values={{ currencyShortName: config.currency.shortName }}
          />
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
          <OptionalField
            value={formatTimestamp(block.timestamp, block.local_timestamp)}
          />
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

      <RawBlockContents block={block} className="mt-5" />
    </div>
  );
}
