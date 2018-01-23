import React from 'react'
import { Route } from 'react-router-dom'

import './Content.css'

import Synchronization from './views/Synchronization'
import Delegators from './views/Delegators'

export default () => {
  return (
    <div id="Content" className="col p-4 h-100">
      <Route exact path="/" component={Synchronization} />
      <Route exact path="/delegators" component={Delegators} />
    </div>
  )
}
