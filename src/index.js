import "babel-polyfill";
import "whatwg-fetch";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ConfigProvider from "./lib/ConfigProvider";
import App from "./App";

import { BrowserRouter as Router } from "react-router-dom";

import { addLocaleData, IntlProvider } from "react-intl";
import en from "react-intl/locale-data/en";

addLocaleData([...en]);

ReactDOM.render(
  <ConfigProvider>
    <IntlProvider locale={navigator.language} messages={messages}>
      <Router>
        <App />
      </Router>
    </IntlProvider>
  </ConfigProvider>,
  document.getElementById("root")
);
