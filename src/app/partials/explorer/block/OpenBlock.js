import React from "react";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";
import PriceWithConversions from "../../PriceWithConversions";

import "./Block.css";

export default function OpenBlock({ block }) {
  return (
    <div className="Block">
      <h4 className="mb-0">
        Account{" "}
        <small>
          <AccountLink
            account={block.contents.account}
            className="text-muted break-word"
          />
        </small>
      </h4>
      <p>
        <small>The account that this block created</small>
      </p>

      <h4 className="mb-0">
        Opened By{" "}
        <small>
          <AccountLink
            className="text-muted break-word"
            account={block.source_account}
          />
        </small>
      </h4>
      <p>
        <small>The account whose transaction opened this account</small>
      </p>

      <h4 className="mb-0">
        Amount{" "}
        <small className="text-muted">
          <PriceWithConversions
            amount={block.amount}
            currencies={["nano", "usd", "btc"]}
          />
        </small>
      </h4>
      <p>
        <small>
          The amount of NANO sent to open this account, which can be 0
        </small>
      </p>

      <h4 className="mb-0">
        Representative{" "}
        <small>
          <AccountLink
            className="text-muted break-word"
            account={block.contents.representative}
          />
        </small>
      </h4>
      <p>
        <small>The representative assigned to this account</small>
      </p>

      <h4 className="mb-0">
        Source{" "}
        <small>
          <BlockLink
            hash={block.contents.source}
            className="text-muted break-word"
          />
        </small>
      </h4>
      <p>
        <small>The corresponding send block for this transaction</small>
      </p>

      <h5>
        Proof of Work{" "}
        <small className="text-muted break-word">{block.contents.work}</small>
      </h5>

      <h5>
        Signature{" "}
        <small className="text-muted break-word">
          {block.contents.signature}
        </small>
      </h5>
    </div>
  );
}
