import React from "react";
import { FormattedNumber, injectIntl } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";

import injectClient from "lib/ClientComponent";
import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";
import OptionalField from "../../../OptionalField";
import { formatTimestamp } from "lib/util";
import { withDefault } from "lib/TranslatedMessage";

function HistoryOpenBlock({ config, block, intl }) {
  return (
    <tr>
      <td className="text-success text-capitalize">
        {intl.formatMessage(withDefault({ id: "block.subtype.open" }))}
      </td>
      <td>
        <span className="text-muted">
          <TranslatedMessage id="block.from" />
        </span>{" "}
        <AccountLink account={block.account} className="text-dark" />
      </td>
      <td className="text-success">
        +<FormattedNumber
          value={block.amount}
          maximumFractionDigits={6}
          minimumFractionDigits={6}
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

export default injectIntl(injectClient(HistoryOpenBlock));
