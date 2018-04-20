import React from "react";
import { Route } from "react-router-dom";

import "./Content.css";

import NodeStatus from "./views/NodeStatus";
import NetworkStatus from "./views/NetworkStatus";
import Explorer from "./views/Explorer";
import Delegators from "./views/Delegators";

export default ({ account }) => {
  return (
    <div id="Content">
      <Route
        exact
        path="/"
        render={props => <NodeStatus {...props} account={account} />}
      />
      <Route
        exact
        path="/network"
        render={props => <NetworkStatus {...props} account={account} />}
      />
      <Route exact path="/explorer" render={props => <Explorer {...props} />} />
      <Route
        exact
        path="/delegators"
        render={props => <Delegators {...props} account={account} />}
      />
    </div>
  );
};
