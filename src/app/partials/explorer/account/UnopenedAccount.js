import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export default function UnopenedAccount({ account }) {
  return (
    <div className="row my-5 justify-content-center">
      <div className="col-md-6 text-center">
        <h2>
          <FormattedMessage id="account.unopened.title" />
        </h2>
        <p>
          <FormattedMessage id="account.unopened.desc" />
        </p>
      </div>
    </div>
  );
}
