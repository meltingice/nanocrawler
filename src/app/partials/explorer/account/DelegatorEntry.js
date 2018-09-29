import React from "react";
import { FormattedNumber } from "react-intl";
import AccountLink from "../../AccountLink";
import config from "client-config.json";

export default function DelegatorEntry({ account, balance }) {
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
