import React from "react";
import { Helmet } from "react-helmet";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";

import "./Content.css";

import Explorer from "./views/Explorer";
import ExplorerAccount from "./views/explorer/LoadableAccount";
import ExplorerBlock from "./views/explorer/LoadableBlock";

import NotFound from "./views/errors/NotFound";
import ServerError from "./views/errors/ServerError";

class Content extends React.Component {
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
      return `/account/${search}`;
    } else if (/[A-F0-9]{64}/.test(search)) {
      return `/block/${search}`;
    } else {
      return "/not_found";
    }
  }

  render() {
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

        <Switch>
          <Route exact path="/" render={props => <Explorer {...props} />} />
          <Route
            path="/auto/:query"
            render={props => (
              <Redirect
                to={this.determineQueryDestination(props.match.params.query)}
              />
            )}
          />

          <Route
            exact
            path="/account/:account"
            render={props => (
              <Redirect to={`/account/${props.match.params.account}/history`} />
            )}
          />
          <Route
            path="/account/:account/:page"
            render={({ match, history, ...props }) => (
              <ExplorerAccount
                key={match.params.account}
                account={match.params.account}
                match={match}
                browserHistory={history}
                {...props}
              />
            )}
          />

          <Route path="/block/:block" component={ExplorerBlock} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(Content);
