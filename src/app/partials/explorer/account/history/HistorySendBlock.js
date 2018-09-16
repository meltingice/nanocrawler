import React from "react";
import { FormattedNumber, FormattedMessage, injectIntl } from "react-intl";

import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";
import OptionalField from "../../../OptionalField";
import { formatTimestamp } from "../../../../../lib/util";

function HistorySendBlock({ block, intl }) {
  return (
    <tr>
      <td className="text-danger text-capitalize">
        {intl.formatMessage({ id: "block.subtype.send" })}
      </td>
      <td>
        <span className="text-muted">
          <FormattedMessage id="block.to" />
        </span>{" "}
        <AccountLink account={block.account} className="text-dark" />
      </td>
      <td className="text-danger">
        -<FormattedNumber
          value={block.amount}
          minimumFractionDigits={6}
          maximumFractionDigits={6}
        />{" "}
        NANO
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
