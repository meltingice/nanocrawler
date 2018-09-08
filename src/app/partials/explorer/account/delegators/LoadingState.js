import React from "react";
import { FormattedMessage } from "react-intl";

export default function LoadingState() {
  return (
    <div className="row my-5 mx-0">
      <div className="col text-center">
        <h2 className="text-muted">
          <FormattedMessage id="account.delegators.loading" />
        </h2>
      </div>
    </div>
  );
}
