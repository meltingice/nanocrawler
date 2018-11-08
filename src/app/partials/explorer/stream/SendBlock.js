import React from "react";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";
import MonKey from "../../MonKey";

export default function SendBlock({ event }) {
  const { block } = event;
  return (
    <div className="row">
      <div className="col">
        <div className="media" className="media align-items-center">
          <MonKey account={block.account} style={{ width: "75px" }} />

          <div className="media-body">
            <p className="mb-0">
              <AccountLink
                account={block.account}
                className="text-dark break-word"
              />
            </p>

            <p className="mb-0">
              <span className="text-danger">
                <TranslatedMessage
                  id="stream.send"
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
      </div>
    </div>
  );
}
