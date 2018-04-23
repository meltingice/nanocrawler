import React from "react";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";
import PriceWithConversions from "../../PriceWithConversions";

export default function ReceiveBlock({ block }) {
  return (
    <div className="Block">
      <h4 className="mb-0">
        Recipient{" "}
        <small>
          <AccountLink
            account={block.block_account}
            className="text-muted break-word"
          />
        </small>
      </h4>
      <p>
        <small>The account that is receiving the transaction</small>
      </p>

      <h4 className="mb-0">
        Sender{" "}
        <small>
          <AccountLink
            account={block.source_account}
            className="text-muted break-word"
          />
        </small>
      </h4>
      <p>
        <small>The account that initiated the transaction</small>
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
