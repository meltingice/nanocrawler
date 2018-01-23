import React from 'react'
import { Route } from 'react-router-dom'

import './Content.css'

import Synchronization from './views/Synchronization'
import Delegators from './views/Delegators'
import Peers from './views/Peers'

export default () => {
  return (
    <div id="Content">
      <Route exact path="/" component={Synchronization} />
      <Route exact path="/delegators" component={Delegators} />
      <Route exact path="/peers" component={Peers} />
    </div>
  )
}
