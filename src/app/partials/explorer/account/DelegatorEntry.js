import React from "react";
import { FormattedNumber } from "react-intl";
import injectClient from "lib/ClientComponent";
import AccountLink from "../../AccountLink";

function DelegatorEntry({ config, account, balance }) {
  return (
    <tr>
      <td>
        <AccountLink account={account} className="text-dark" delegators />
      </td>
      <td>
        <FormattedNumber
          value={balance}
          maximumFractionDigits={6}
          minimumFractionDigits={6}
        />{" "}
        {config.currency}
      </td>
    </tr>
  );
}

export default injectClient(DelegatorEntry);
