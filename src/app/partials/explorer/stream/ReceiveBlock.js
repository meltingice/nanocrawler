import React from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";

export default function ReceiveBlock({ event }) {
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
        <p className="mb-0">
          <span className="text-success">
            <FormattedMessage
              id="stream.receive"
              values={{
                amount: (
                  <FormattedNumber
                    value={block.amount}
                    maximumFractionDigits={6}
                  />
                )
              }}
            />
          </span>
        </p>
        <p className="mb-0">
          <BlockLink hash={block.hash} className="text-muted break-word" />
        </p>
      </div>
    </div>
  );
}
