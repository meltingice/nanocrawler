import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'

import Navigation from './app/Navigation'
import Content from './app/Content'

export default class App extends Component {
  render() {
    return (
      <div id="App" className="container-fluid p-0 h-100">
        <div className="row h-100">
          <Navigation />
          <Content />
        </div>
      </div>
    )
  }
}
