import React from "react";
import { FormattedMessage } from "react-intl";

export default function EmptyState() {
  return (
    <div className="row my-5 mx-0 justify-content-center">
      <div className="col-md-6 text-center">
        <h2>
          <FormattedMessage id="account.delegators.empty_state.title" />
        </h2>
        <p>
          <FormattedMessage id="account.delegators.empty_state.desc" />
        </p>
      </div>
    </div>
  );
}
