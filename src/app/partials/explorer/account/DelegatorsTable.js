import React from "react";
import { TranslatedMessage } from "lib/TranslatedMessage";
import _ from "lodash";

import DelegatorEntry from "./DelegatorEntry";

export default function DelegatorsTable({ delegators }) {
  const sortedDelegators = _.toPairs(delegators)
    .filter(d => parseFloat(d[1], 10) >= 1)
    .sort((a, b) => {
      const aBalance = parseFloat(a[1], 10);
      const bBalance = parseFloat(b[1], 10);
      if (aBalance < bBalance) return 1;
      if (aBalance > bBalance) return -1;
      return 0;
    });

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th className="text-capitalize">
              <TranslatedMessage id="account" />
            </th>
            <th>
              <TranslatedMessage id="account.delegators.weight" />
            </th>
          </tr>
        </thead>

        <tbody>
          {_.map(sortedDelegators, d => (
            <DelegatorEntry key={d[0]} account={d[0]} balance={d[1]} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
