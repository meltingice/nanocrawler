import React from "react";
import { IntlProvider } from "react-intl";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "primer-tooltips/build/build.css";

import { withTranslations } from "./lib/TranslationContext";
import Content from "./app/Content";

import AccountLink from "./app/partials/AccountLink";
import LanguageChooser from "./app/partials/LanguageChooser";

function App({ locale }) {
  return (
    <IntlProvider locale={locale.language} messages={locale.messages}>
      <div id="App" className="container-fluid p-0 h-100">
        <Content />

        <hr />

        <div className="row mr-0 align-items-center">
          <div className="col-md">
            <div className="py-2 px-4">
              <p>
                Powered by{" "}
                <a href="https://nanocrawler.cc" target="_blank">
                  NanoCrawler
                </a>
              </p>
            </div>
          </div>
          <div className="col-auto">
            <LanguageChooser />
          </div>
        </div>
      </div>
    </IntlProvider>
  );
}

export default withTranslations(App);
