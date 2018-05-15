import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function NotFoundBlock({ block }) {
  return (
    <div className="p-4">
      <Helmet>
        <title>Block - Not Found</title>
      </Helmet>

      <div className="row">
        <div className="col">
          <h1 className="mb-0">Unknown Block</h1>
          <p className="text-muted">{block}</p>
        </div>
      </div>

      <hr />

      <div className="row my-5 justify-content-center">
        <div className="col-md-8 text-center">
          <h2>This block hasn't been received yet</h2>
          <p>
            NANO is a completely asynchronous cryptocurrency. Because of this,
            sometimes transactions can take a few extra seconds to broadcast
            througout the entire network.
          </p>

          <p>
            If you're sure the block hash is correct, wait a little bit and
            refresh the page.
          </p>

          <p className="mt-4">
            <Link to="/" className="btn btn-nano-primary">
              Return to the Explorer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
