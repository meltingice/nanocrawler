import React from 'react'
import ReactSVG from 'react-svg'
import { NavLink } from 'react-router-dom'

import './Navigation.css'
import Logo from './images/logo.svg'
import PriceTicker from './partials/PriceTicker'

export default () => {
  return (
    <div id="Navigation" className="col p-4 h-100">
      <div className="LogoWrap">
        <ReactSVG path={Logo} className="Logo" /> Node Dashboard
      </div>

      <div className="mt-3">
        <PriceTicker />
      </div>

      <ul className="NavigationList list-group list-group-flush mt-4">
        <li className="list-group-item">
          <NavLink exact to="/" activeClassName="active">Node Status</NavLink>
        </li>
        <li className="list-group-item">
          <NavLink exact to="/account" activeClassName="active">Account</NavLink>
        </li>
        <li className="list-group-item">
          <NavLink exact to="/delegators" activeClassName="active">Delegators</NavLink>
        </li>
      </ul>
    </div>
  )
}
