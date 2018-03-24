import React from 'react'
import { Route } from 'react-router-dom'

import './Content.css'

import NodeStatus from './views/NodeStatus'
import Delegators from './views/Delegators'
import Peers from './views/Peers'

export default ({ account }) => {
  return (
    <div id="Content">
      <Route exact path="/" render={(props) => <NodeStatus {...props} account={account} />} />
      <Route exact path="/delegators" component={Delegators} />
      <Route exact path="/peers" component={Peers} />
    </div>
  )
}
