import React from "react";
import { Link } from "react-router-dom";
import { TranslatedMessage } from "lib/TranslatedMessage";

export default function UnopenedAccount({ account }) {
  return (
    <div className="row my-5 justify-content-center">
      <div className="col-md-6 text-center">
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
