import React from "react";
import { Link } from "react-router-dom";
import { TranslatedMessage } from "lib/TranslatedMessage";

export default function UnopenedAccount() {
  return (
    <div className="row mt-5 justify-content-center">
      <div className="col col-md-6 text-center">
        <h2>
          <TranslatedMessage id="account.unopened.title" />
        </h2>
        <p>
          <TranslatedMessage id="account.unopened.desc" />
        </p>
      </div>
    </div>
  );
}
