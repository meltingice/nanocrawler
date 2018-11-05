import "babel-polyfill";
import "whatwg-fetch";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { TickerProvider } from "lib/TickerContext";
import { TranslationProvider } from "lib/TranslationContext";
import { NetworkProvider } from "lib/NetworkContext";
import App from "./App";

import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <TranslationProvider>
    <TickerProvider>
      <NetworkProvider>
        <Router>
          <App />
        </Router>
      </NetworkProvider>
    </TickerProvider>
  </TranslationProvider>,
  document.getElementById("root")
);
