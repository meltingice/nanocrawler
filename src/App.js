import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'

import injectClient from './lib/ClientComponent'
import Navigation from './app/Navigation'
import Content from './app/Content'

import AccountWeight from './app/partials/AccountWeight'

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
        <div className="row h-100 mr-0">
          <Navigation />

          <div className="col p-0 h-100 ContentContainer">
            <AccountWeight account={this.state.account} />

            <Content account={this.state.account} />
          </div>
        </div>
      </div>
    )
  }
}

export default injectClient(App)
