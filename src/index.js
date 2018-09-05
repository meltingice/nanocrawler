import "babel-polyfill";
import "whatwg-fetch";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ConfigProvider from "./lib/ConfigProvider";
import App from "./App";

import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <ConfigProvider>
    <Router>
      <App />
    </Router>
  </ConfigProvider>,
  document.getElementById("root")
);
