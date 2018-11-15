import React from "react";
import { Link } from "react-router-dom";
import { TranslatedMessage } from "lib/TranslatedMessage";
import config from "client-config.json";

export default function UnopenedAccount() {
  return (
    <div className="row mt-5 justify-content-center">
      <div className="col col-md-6 text-center">
        <h2>
          <TranslatedMessage id="account.unopened.title" />
        </h2>
        <p>
          <TranslatedMessage
            id="account.unopened.desc"
            values={{ currencyShortName: config.currency.shortName }}
          />
        </p>
      </div>
    </div>
  );
}
