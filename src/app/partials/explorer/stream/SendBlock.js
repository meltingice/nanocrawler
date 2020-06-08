import React from "react";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";
import { withNatriconData } from "lib/NatriconContext";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";
import Natricon from "../../Natricon";
import config from "client-config.json";

function SendBlock({ natricon, event }) {
  const { block } = event;
  return (
    <div className="row">
      {natricon.enabled && <div className="col col-lg-auto text-center pr-lg-0">
        <Natricon account={block.account} style={{ width: "75px" }} />
      </div>}
      <div className="col">
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
                currencyShortName: config.currency.shortName,
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

export default withNatriconData(SendBlock)