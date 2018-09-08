import React from "react";
import { injectIntl } from "react-intl";
import _ from "lodash";
import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";
import OptionalField from "../../../OptionalField";
import { formatTimestamp } from "../../../../../lib/util";

function HistoryChangeBlock({ block, intl }) {
  return (
    <tr>
      <td className="text-info">
        {_.capitalize(intl.formatMessage({ id: "block.subtype.change" }))}
      </td>
      <td>
        <AccountLink
          account={block.representative}
          ninja
          className="text-dark"
        />
      </td>
      <td>
        <i className="text-muted">N/A</i>
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

export default injectIntl(HistoryChangeBlock);
