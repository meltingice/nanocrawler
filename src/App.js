import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'

import Navigation from './app/Navigation'
import Content from './app/Content'

import AccountEntry from './app/views/AccountEntry'

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: ""
    };
  }

  render() {
    return (
      <div id="App" className="container-fluid p-0 h-100">
        <div className="row h-100 mr-0">
          <Navigation />

          <div className="col p-0 h-100">
            <AccountEntry
              account={this.state.account}
              onChange={account => this.setState({ account })}
            />

            <Content account={this.state.account} />
          </div>
        </div>
      </div>
    )
  }
}
