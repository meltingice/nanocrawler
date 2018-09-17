import React from "react";
import { TranslatedMessage } from "lib/TranslatedMessage";

export default function LoadingState() {
  return (
    <div className="row my-5 mx-0">
      <div className="col text-center">
        <h2 className="text-muted">
          <TranslatedMessage id="account.delegators.loading" />
        </h2>
      </div>
    </div>
  );
}
