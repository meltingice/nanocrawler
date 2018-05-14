import "babel-polyfill";
import "whatwg-fetch";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ConfigProvider from "./lib/ConfigProvider";
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
  <ConfigProvider>
    <Router history={history}>
      <App />
    </Router>
  </ConfigProvider>,
  document.getElementById("root")
);
