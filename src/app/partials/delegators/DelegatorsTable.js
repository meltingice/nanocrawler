import React from "react";
import _ from "lodash";

import DelegatorEntry from "./DelegatorEntry";

export default function DelegatorsTable({ delegators }) {
  const sortedDelegators = _.toPairs(delegators).sort((a, b) => {
    const aBalance = parseFloat(a[1]);
    const bBalance = parseFloat(b[1]);
    if (aBalance < bBalance) return 1;
    if (aBalance > bBalance) return -1;
    return 0;
  });

  return (
    <table className="table table-sm">
      <thead>
        <tr>
          <th>Account</th>
          <th>Delegated Weight</th>
        </tr>
      </thead>

      <tbody>
        {_.map(sortedDelegators, d => (
          <DelegatorEntry key={d[0]} account={d[0]} balance={d[1]} />
        ))}
      </tbody>
    </table>
  );
}
