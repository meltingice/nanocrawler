import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import injectClient from "./lib/ClientComponent";
import Navigation from "./app/Navigation";
import Content from "./app/Content";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: null
    };
  }

  async componentWillMount() {
    this.setState({ account: await this.props.client.account() });
  }

  render() {
    return (
      <div id="App" className="container-fluid p-0 h-100">
        <div className="row Header align-items-center mr-0">
          <div className="col">
            <Navigation />
          </div>
        </div>

        <Content account={this.state.account} />

        <hr />

        <div className="row mr-0">
          <div className="col">
            <div className="py-2 px-4">
              <p>
                Created by Ryan LeFevre, Sr. Software Engineer at{" "}
                <a href="https://www.hodinkee.com" target="_blank">
                  HODINKEE
                </a>
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
    );
  }
}

export default injectClient(App);
