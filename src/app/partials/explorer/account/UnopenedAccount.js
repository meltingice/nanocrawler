import React from "react";
import { Link } from "react-router-dom";

export default function UnopenedAccount({ account }) {
  return (
    <div className="p-4">
      <div className="row">
        <div className="col">
          <h1 className="mb-0">Unopened Account</h1>
          <p className="text-muted">{account}</p>
        </div>
      </div>

      <hr />

      <div className="row my-5 justify-content-center">
        <div className="col-md-6 text-center">
          <h2>This account hasn't been opened yet</h2>
          <p>
            While the account address is valid, no blocks have been published to
            its chain yet. If NANO has been sent to this account, it still needs
            to publish a corresponding receive block to pocket the funds.
          </p>

          <p className="mt-4">
            <Link to="/explorer" className="btn btn-nano-primary">
              Return to the Explorer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
