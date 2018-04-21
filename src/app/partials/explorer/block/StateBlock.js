import React from "react";
import accounting from "accounting";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";
import PriceWithConversions from "../../PriceWithConversions";

import "./Block.css";

export default function StateBlock({ block }) {
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
        <small>The account represented by this state block</small>
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
        <small>The amount of NANO that was sent in this transaction</small>
      </p>

      <h4 className="mb-0">
        Balance{" "}
        <small className="text-muted">
          <PriceWithConversions
            amount={block.contents.balance}
            currencies={["nano", "usd", "btc"]}
          />
        </small>
      </h4>
      <p>
        <small>The balance of this account after this transaction</small>
      </p>

      <h4 className="mb-0">
        Representative{" "}
        <small>
          <AccountLink
            account={block.contents.representative}
            className="text-muted break-word"
          />
        </small>
      </h4>
      <p>
        <small>The account's representative</small>
      </p>

      <h5 className="mb-0">
        Previous Block{" "}
        <small>
          <BlockLink
            hash={block.contents.previous}
            className="text-muted break-word"
          />
        </small>
      </h5>
      <p>
        <small>The previous block in this account's chain</small>
      </p>

      <h5>
        Link{" "}
        <small className="text-muted break-word">{block.contents.link}</small>
      </h5>

      <h5>
        Link as account{" "}
        <small>
          <AccountLink
            account={block.contents.link_as_account}
            className="text-muted break-word"
          />
        </small>
      </h5>

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
