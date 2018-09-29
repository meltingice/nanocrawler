import "babel-polyfill";
import "whatwg-fetch";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { TickerProvider } from "lib/TickerContext";
import { TranslationProvider } from "lib/TranslationContext";
import App from "./App";

import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";

const history = createBrowserHistory();
history.listen(location => {
  if (window.ga) {
    console.log("tracking page view: " + location.pathname);
    window.ga("set", "page", location.pathname);
    window.ga("send", "pageview");
  } else {
    console.log("GA unavailable");
  }
});

ReactDOM.render(
  <TranslationProvider>
    <TickerProvider>
      <Router history={history}>
        <App />
      </Router>
    </TickerProvider>
  </TranslationProvider>,
  document.getElementById("root")
);
