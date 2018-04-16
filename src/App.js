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
      </div>
    );
  }
}

export default injectClient(App);
