import React from 'react'
import { Route } from 'react-router-dom'

import './Content.css'

import NodeStatus from './views/NodeStatus'
import Account from './views/Account'

export default ({ account }) => {
  return (
    <div id="Content">
      <Route exact path="/" render={(props) => <NodeStatus {...props} account={account} />} />
      <Route exact path="/account" render={(props => <Account {...props} account={account} />)} />
    </div>
  )
}
