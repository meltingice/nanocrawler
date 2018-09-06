import React from "react";
import { FormattedMessage } from "react-intl";

export default function ServerError() {
  return (
    <div className="row my-5 justify-content-center">
      <div className="col-6 text-center">
        <h1 className="display-1">500</h1>
        <h3>
          <FormattedMessage id="error.server_error" />
        </h3>
      </div>
    </div>
  );
}
