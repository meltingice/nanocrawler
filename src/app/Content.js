import React from "react";
import { Helmet } from "react-helmet";
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
        <Helmet>
          <meta charSet="utf-9" />
          <meta
            name="description"
            content="Network data tracking and browsing for the NANO cryptocurrency"
          />
          <title>Nano Crawler</title>
        </Helmet>

        <div className="row justify-content-center">
          <div className="col-8 mt-5">
            <div className="alert alert-info mb-5">
              NanoCrawler has moved servers and is still in the process of
              syncing. If transactions or accounts appear to be missing, it's
              because of this. Keep an eye on the{" "}
              <a href="/status">Node Status</a> page for more information.
            </div>
          </div>
        </div>

        <Switch>
          <Route exact path="/" render={props => <Explorer {...props} />} />
          <Route
            exact
            path="/network"
            render={props => <NetworkStatus {...props} account={account} />}
          />
          <Route
            exact
            path="/status"
            render={props => <NodeStatus {...props} account={account} />}
          />
          <Route exact path="/explorer" render={props => <Redirect to="/" />} />
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
            exact
            path="/explorer/account/:account"
            render={props => (
              <Redirect
                to={`/explorer/account/${props.match.params.account}/history`}
              />
            )}
          />
          <Route
            path="/explorer/account/:account/:page"
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
