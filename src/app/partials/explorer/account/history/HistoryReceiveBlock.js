import React from "react";
import { FormattedMessage, FormattedNumber, injectIntl } from "react-intl";
import _ from "lodash";

import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";
import OptionalField from "../../../OptionalField";
import { formatTimestamp } from "../../../../../lib/util";

function HistoryReceiveBlock({ block, intl }) {
  return (
    <tr>
      <td className="text-success">
        {_.capitalize(intl.formatMessage({ id: "block.subtype.receive" }))}
      </td>
      <td>
        <span className="text-muted">
          <FormattedMessage id="block.from" />
        </span>{" "}
        <AccountLink account={block.account} className="text-dark" />
      </td>
      <td className="text-success">
        +<FormattedNumber
          value={block.amount}
          maximumFractionDigits={6}
          minimumFractionDigits={6}
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

export default injectIntl(HistoryReceiveBlock);
