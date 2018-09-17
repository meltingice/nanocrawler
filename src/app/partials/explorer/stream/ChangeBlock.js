import React from "react";
import { TranslatedMessage } from "lib/TranslatedMessage";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";

export default function ChangeBlock({ event }) {
  const { block } = event;
  return (
    <div className="row">
      <div className="col">
        <p className="mb-0">
          <AccountLink
            account={block.account}
            className="text-dark break-word"
          />
        </p>
        <p className="mb-0 text-info">
          <TranslatedMessage id="stream.change" />
        </p>
        <p className="mb-0">
          <AccountLink
            account={block.representative}
            className="text-dark break-word"
          />
        </p>
        <p>
          <BlockLink hash={block.hash} className="text-muted break-word" />
        </p>
      </div>
    </div>
  );
}
