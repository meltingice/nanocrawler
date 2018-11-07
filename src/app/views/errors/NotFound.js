import React from "react";
import { TranslatedMessage } from "lib/TranslatedMessage";

export default function NotFound() {
  return (
    <div className="row my-5 mx-0">
      <div className="col text-center">
        <h1 className="display-1">404</h1>
        <h3 className="mb-4">
          <TranslatedMessage id="error.not_found" />
        </h3>
      </div>
    </div>
  );
}
