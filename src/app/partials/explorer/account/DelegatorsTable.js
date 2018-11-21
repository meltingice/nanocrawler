import React from "react";
import BigNumber from "bignumber.js";
import toPairs from "lodash/toPairs";
import { TranslatedMessage } from "lib/TranslatedMessage";

import DelegatorEntry from "./DelegatorEntry";

export default function DelegatorsTable({ delegators }) {
  const sortedDelegators = toPairs(delegators)
    .map(d => [d[0], BigNumber(d[1])])
    .filter(d => d[1].gte(1))
    .sort((a, b) => {
      if (a[1].lt(b[1])) return 1;
      if (a[1].gt(b[1])) return -1;
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
          {sortedDelegators.map(d => (
            <DelegatorEntry
              key={d[0]}
              account={d[0]}
              balance={d[1].toString()}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
