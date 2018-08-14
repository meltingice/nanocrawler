import React from "react";
import accounting from "accounting";
import AccountLink from "../../AccountLink";

export default function DelegatorEntry({ account, balance }) {
  return (
    <tr>
      <td>
        <AccountLink account={account} className="text-dark" delegators />
      </td>
      <td>{accounting.formatNumber(balance, 6)} βNANO</td>
    </tr>
  );
}
