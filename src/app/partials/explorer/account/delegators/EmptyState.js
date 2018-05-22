import React from "react";

export default function EmptyState() {
  return (
    <div className="row my-5 mx-0 justify-content-center">
      <div className="col-md-6 text-center">
        <h2>This account has no delegators</h2>
        <p>
          Although this account is valid, no one is currently lending their
          voting weight to it. If the account is usually offline, this is a good
          thing.
        </p>
      </div>
    </div>
  );
}
