import React, { Component } from "react";
import { IntlProvider } from "react-intl";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "primer-tooltips/build/build.css";

import injectClient from "./lib/ClientComponent";
import Navigation from "./app/Navigation";
import Content from "./app/Content";

import AccountLink from "./app/partials/AccountLink";

class App extends Component {
  state = { account: null };

  async componentWillMount() {
    this.setState({ account: await this.props.client.account() });
  }

  render() {
    const { locale } = this.props;

    return (
      <IntlProvider locale={locale.language} messages={locale.messages}>
        <div id="App" className="container-fluid p-0 h-100">
          <div className="row Header align-items-center mr-0">
            <div className="col">
              <Navigation />
            </div>
          </div>

          <Content account={this.state.account} />

          <hr />

          <div className="row mr-0 align-items-center">
            <div className="col-md">
              <div className="py-2 px-4">
                <p className="mb-0">
                  Created by Ryan LeFevre, Sr. Software Engineer at{" "}
                  <a href="https://www.hodinkee.com" target="_blank">
                    HODINKEE
                  </a>
                </p>
                <p>
                  Donations:{" "}
                  <AccountLink account="xrb_3xemzomy4atzmq5u55mzzixqw9zxykyeyeiqia7rb1xy1saufpr8wzder1xh" />
                </p>
              </div>
            </div>
            <div className="col-auto">
              <div className="py-2 px-4">
                <a href="https://twitter.com/meltingice" target="_blank">
                  Twitter
                </a>{" "}
                &bull;{" "}
                <a href="https://reddit.com/u/meltingice" target="_blank">
                  Reddit
                </a>{" "}
                &bull;{" "}
                <a
                  href="https://github.com/meltingice/nano-node-dashboard"
                  target="_blank"
                >
                  Source code
                </a>
              </div>
            </div>
          </div>
        </div>
      </IntlProvider>
    );
  }
}

export default injectClient(App);
