import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

import DelegatorEntry from "./DelegatorEntry";

function DelegatorsTable({ delegators, intl }) {
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
            <th>{_.capitalize(intl.formatMessage({ id: "account" }))}</th>
            <th>
              <FormattedMessage id="account.delegators.weight" />
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

export default injectIntl(DelegatorsTable);
