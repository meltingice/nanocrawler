import React from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";

import "./Content.css";

import NodeStatus from "./views/NodeStatus";
import NetworkStatus from "./views/NetworkStatus";

import Explorer from "./views/Explorer";
import ExplorerAccount from "./views/explorer/Account";
import ExplorerBlock from "./views/explorer/Block";
import RichList from "./views/explorer/RichList";

import NotFound from "./views/errors/NotFound";
import ServerError from "./views/errors/ServerError";

class Content extends React.PureComponent {
  state = {
    hasError: false
  };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({ hasError: false });
    }
  }

  determineQueryDestination(search) {
    if (/^(xrb_|nano_)\w+/.test(search)) {
      return `/explorer/account/${search}`;
    } else if (/[A-F0-9]{64}/.test(search)) {
      return `/explorer/block/${search}`;
    } else {
      return "/not_found";
    }
  }

  render() {
    const { account } = this.props;

    if (this.state.hasError) {
      return <ServerError />;
    }

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
          <Route
            exact
            path="/explorer/top_accounts"
            render={props => <RichList {...props} />}
          />
          <Route
            path="/explorer/auto/:query"
            render={props => (
              <Redirect
                to={this.determineQueryDestination(props.match.params.query)}
              />
            )}
          />

          <Route
            path="/explorer/account/:account"
            component={ExplorerAccount}
          />
          <Route path="/explorer/block/:block" component={ExplorerBlock} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(Content);
