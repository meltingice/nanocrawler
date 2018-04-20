import React, { Fragment } from "react";
import accounting from "accounting";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";

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

      <h4>
        Amount Sent{" "}
        <small className="text-muted">
          {accounting.formatNumber(block.amount, 6)} NANO
        </small>
      </h4>

      <h4>
        Opened By{" "}
        <small>
          <AccountLink
            className="text-muted break-word"
            account={block.source_account}
          />
        </small>
      </h4>

      <h4>
        Representative{" "}
        <small>
          <AccountLink
            className="text-muted break-word"
            account={block.contents.representative}
          />
        </small>
      </h4>

      <h4>
        Source{" "}
        <small>
          <BlockLink
            hash={block.contents.source}
            className="text-muted break-word"
          />
        </small>
      </h4>

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
