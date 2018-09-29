import React from "react";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";

import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";
import OptionalField from "../../../OptionalField";
import { formatTimestamp } from "lib/util";
import config from "client-config.json";

export default function HistorySendBlock({ block }) {
  return (
    <tr>
      <td className="text-danger text-capitalize">
        <TranslatedMessage id="block.subtype.send" />
      </td>
      <td>
        <span className="text-muted">
          <TranslatedMessage id="block.to" />
        </span>{" "}
        <AccountLink account={block.account} className="text-dark" />
      </td>
      <td className="text-danger">
        -<FormattedNumber
          value={block.amount}
          minimumFractionDigits={6}
          maximumFractionDigits={6}
        />{" "}
        {config.currency}
      </td>
      <td>
        <OptionalField value={formatTimestamp(block.timestamp)} />
      </td>
      <td>
        <BlockLink hash={block.hash} short className="text-muted" />
      </td>
    </tr>
  );
}
