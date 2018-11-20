import React from "react";
import { IntlProvider } from "react-intl";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "primer-tooltips/build/build.css";

import config from "client-config.json";
import { withTranslations } from "./lib/TranslationContext";
import Navigation from "./app/Navigation";
import Content from "./app/Content";

import AccountLink from "./app/partials/AccountLink";

function App({ locale }) {
  return (
    <IntlProvider locale={locale.language} messages={locale.messages}>
      <div id="App" className="container-fluid p-0 h-100">
        <div className="row Header align-items-center mr-0">
          <div className="col">
            <Navigation />
          </div>
        </div>

        <Content />

        <hr />

        <div className="row mr-0 align-items-center">
          <div className="col-md">
            <div className="py-2 px-4">
              <p className="mb-0">Created by Ryan LeFevre (@meltingice)</p>
              <p>
                Donations: <AccountLink account={config.donationAddress} />
              </p>
            </div>
          </div>
          <div className="col-auto">
            <div className="py-2 px-4">
              <a href="https://twitter.com/meltingice" target="_blank">
                Twitter
              </a>{" "}
              &bull;{" "}
              <a href="https://reddit.com/u/meltingice" target="_blank">
                Reddit
              </a>{" "}
              &bull;{" "}
              <a
                href="https://github.com/meltingice/nano-node-dashboard"
                target="_blank"
              >
                Source code
              </a>
            </div>
          </div>
        </div>
      </div>
    </IntlProvider>
  );
}

export default withTranslations(App);
