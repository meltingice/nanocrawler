import React from "react";
import { Switch, Route } from "react-router-dom";

import "./Content.css";

import NodeStatus from "./views/NodeStatus";
import NetworkStatus from "./views/NetworkStatus";

import Explorer from "./views/Explorer";
import ExplorerAccount from "./views/explorer/Account";
import ExplorerBlock from "./views/explorer/Block";

import NotFound from "./views/errors/NotFound";

export default ({ account }) => {
  return (
    <div id="Content">
      <Switch>
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
        <Route
          exact
          path="/explorer"
          render={props => <Explorer {...props} />}
        />
        <Route path="/explorer/account/:account" component={ExplorerAccount} />
        <Route path="/explorer/block/:block" component={ExplorerBlock} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};
