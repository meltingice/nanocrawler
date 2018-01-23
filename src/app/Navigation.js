import React from 'react'
import { NavLink } from 'react-router-dom'

import './Navigation.css'
import Logo from './images/logo.png'

export default () => {
  return (
    <div id="Navigation" className="col p-4 h-100">
      <div className="LogoWrap">
        <img src={Logo} /> RaiBlocks Control Panel
      </div>

      <ul className="NavigationList list-group list-group-flush mt-4">
        <li className="list-group-item">
          <NavLink exact to="/" activeClassName="active">Synchronization</NavLink>
        </li>
        <li className="list-group-item">
          <NavLink exact to="/delegators" activeClassName="active">Delegators</NavLink>
        </li>
      </ul>
    </div>
  )
}
