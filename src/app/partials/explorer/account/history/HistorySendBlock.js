import React from "react";
import { FormattedNumber, injectIntl } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";

import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";
import OptionalField from "../../../OptionalField";
import { formatTimestamp } from "lib/util";
import { withDefault } from "lib/TranslatedMessage";
import config from "client-config.json";

function HistorySendBlock({ block, intl }) {
  return (
    <tr>
      <td className="text-danger text-capitalize">
        {intl.formatMessage(withDefault({ id: "block.subtype.send" }))}
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

export default injectIntl(HistorySendBlock);
