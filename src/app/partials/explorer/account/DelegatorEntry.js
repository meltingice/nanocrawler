import React from "react";
import { FormattedNumber } from "react-intl";
import AccountLink from "../../AccountLink";
import config from "client-config.json";
import Currency from "lib/Currency";

export default function DelegatorEntry({ account, balance }) {
  return (
    <tr>
      <td>
        <AccountLink account={account} className="text-dark" delegators />
      </td>
      <td>
        <FormattedNumber
          value={Currency.fromRaw(balance)}
          maximumFractionDigits={6}
        />{" "}
        {config.currency.shortName}
      </td>
    </tr>
  );
}
