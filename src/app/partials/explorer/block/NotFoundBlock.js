import React from "react";
import { TranslatedMessage } from "lib/TranslatedMessage";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import config from "client-config.json";

export default function NotFoundBlock({ block }) {
  return (
    <div className="p-4">
      <Helmet title="Block - Not Found" />

      <div className="row">
        <div className="col">
          <h1 className="mb-0">
            <TranslatedMessage id="block.unknown" />{" "}
          </h1>
          <p className="text-muted text-monospace break-word">{block}</p>
        </div>
      </div>

      <hr />

      <div className="row my-5 justify-content-center">
        <div className="col-md-8 text-center">
          <h2>
            <TranslatedMessage id="block.unknown.title" />
          </h2>
          <p>
            <TranslatedMessage
              id="block.unknown.desc"
              values={{ currency: config.currency.name }}
            />
          </p>

          <p>
            <TranslatedMessage id="block.unknown.desc2" />
          </p>

          <p className="mt-4">
            <Link to="/" className="btn btn-nano-primary">
              <TranslatedMessage id="block.unknown.return" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
