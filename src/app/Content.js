import React from "react";
import { Route } from "react-router-dom";

import "./Content.css";

import NodeStatus from "./views/NodeStatus";
import Account from "./views/Account";
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
        path="/account"
        render={props => <Account {...props} account={account} />}
      />
      <Route
        exact
        path="/delegators"
        render={props => <Delegators {...props} account={account} />}
      />
    </div>
  );
};
