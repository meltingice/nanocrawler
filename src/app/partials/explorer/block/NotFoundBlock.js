import React from "react";
import { FormattedMessage } from "react-intl";
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
          <h1 className="mb-0">
            <FormattedMessage id="block.unknown" />{" "}
          </h1>
          <p className="text-muted">{block}</p>
        </div>
      </div>

      <hr />

      <div className="row my-5 justify-content-center">
        <div className="col-md-8 text-center">
          <h2>
            <FormattedMessage id="block.unknown.title" />
          </h2>
          <p>
            <FormattedMessage id="block.unknown.desc" />
          </p>

          <p>
            <FormattedMessage id="block.unknown.desc2" />
          </p>

          <p className="mt-4">
            <Link to="/" className="btn btn-nano-primary">
              <FormattedMessage id="block.unknown.return" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
